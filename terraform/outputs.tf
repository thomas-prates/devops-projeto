output "vpc_id" {
  description = "ID da VPC criada"
  value       = aws_vpc.main.id
}

output "subnet_id" {
  description = "ID da subnet pública"
  value       = aws_subnet.public.id
}

output "instance_id" {
  description = "ID da instância EC2"
  value       = aws_instance.server.id
}

output "instance_public_ip" {
  description = "IP público da instância EC2"
  value       = aws_instance.server.public_ip
}