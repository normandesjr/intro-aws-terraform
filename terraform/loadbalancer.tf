module "alb" {
  source  = "terraform-aws-modules/alb/aws"
  version = "~> 5.0"

  name = "zup-alb"

  load_balancer_type = "application"

  vpc_id = aws_vpc.main.id
  subnets = flatten(chunklist(aws_subnet.public_subnet.*.id, 1))
  security_groups    = [aws_security_group.load_balancer_ingress.id, aws_security_group.load_balancer_tg.id]

  target_groups = [
    {
      name_prefix      = "zup"
      backend_protocol = "HTTP"
      backend_port     = 8080
      target_type      = "instance"
      health_check = {
        path = "/actuator/health"
        matcher = 200
        interval = 60
        healthy_threshold = 2
        unhealthy_threshold = 2
        timeout = 10
      }
    }
  ]

  http_tcp_listeners = [
    {
      port               = 80
      protocol           = "HTTP"
      target_group_index = 0
    }
  ]
}

resource "aws_lb_target_group_attachment" "alb_group_attachment" {
  count = "3"
  target_group_arn = module.alb.target_group_arns[0]
  target_id = element(aws_instance.instances.*.id, count.index)
  port = 8080
}

output "lb_dns_name" {
  value = module.alb.this_lb_dns_name
}