resource "aws_security_group" "sg" {
  name = "devops-sg"
}

resource "aws_instance" "server" {
  ami           = "ami-xxxxxxxx"
  instance_type = var.instance_type

  vpc_security_group_ids = [
    aws_security_group.sg.id
  ]
}