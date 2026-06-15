# GenAIHub Terraform

Infrastructure as Code for GenAIHub on AWS.

## Resources

- VPC
- Public Subnet
- Internet Gateway and Route Table
- Security Group
- EC2 Instance

## Prerequisites

- [Terraform](https://www.terraform.io/downloads) installed
- AWS CLI configured with credentials

## Usage

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

Destroy infrastructure:

```bash
terraform destroy
```

## Viva Answer

**Terraform provisions infrastructure using code.**

It lets you define cloud resources in `.tf` files, version them in Git, and create/update infrastructure consistently with `plan` and `apply`.
