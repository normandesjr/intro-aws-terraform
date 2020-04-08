resource "aws_key_pair" "keypair" {
  public_key = file("key/zup_key.pub")
}

resource "aws_instance" "instances" {
  count = 3

  ami = "ami-0fc61db8544a617ed"
  instance_type = "t2.micro"

  subnet_id = element(aws_subnet.public_subnet.*.id, count.index)

  key_name = aws_key_pair.keypair.key_name
    
  tags = {
    Name = "zup_instances"
  }
}