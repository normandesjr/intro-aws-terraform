resource "aws_security_group" "allow_ssh" {
  vpc_id = aws_vpc.main.id
  name = "zup_allow_ssh"

  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "database" {
  vpc_id = aws_vpc.main.id
  name = "zup_database"

  ingress {
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    self = true
  }
}

resource "aws_security_group" "allow_outbound" {
  vpc_id = aws_vpc.main.id
  name = "zup_allow_outbound"

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "load_balancer_ingress" {
  vpc_id = aws_vpc.main.id
  name = "zup_load_balancer_ingress"

  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 8080
    to_port = 8080
    protocol = "tcp"
    security_groups = [aws_security_group.load_balancer_tg.id]
  }
}

resource "aws_security_group" "load_balancer_tg" {
  vpc_id = aws_vpc.main.id
  name = "zup_load_balancer_tg"

  ingress {
    from_port = 8080
    to_port = 8080
    protocol = "tcp"
    self = true
  }
}
