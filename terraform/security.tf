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
