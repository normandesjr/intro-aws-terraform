resource "aws_s3_bucket" "bucket_slack_lambda" {
  bucket = "zup-slack-lambda-bucket"

  tags = {
    Name = "Zup Lambda Slack Bucket"
  }
}

resource "aws_iam_role" "lambda_exec_role" {
    name = "LambdaExecRole"

    assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "aws_lambda_vpc_access" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_lambda_function" "slack_lambda_function" {
    function_name   = "SlackLambdaFunction"

    s3_bucket       = aws_s3_bucket.bucket_slack_lambda.id
    s3_key          = "v1.2.0/zup-lambda.zip"

    handler         = "main.handler"
    runtime         = "nodejs12.x"

    role            = aws_iam_role.lambda_exec_role.arn
    
    vpc_config {
        subnet_ids          = flatten(chunklist(aws_subnet.public_subnet.*.id, 1))
        security_group_ids  = [aws_security_group.database.id, aws_security_group.allow_outbound.id]
    }

    environment {
        variables = {
            PGDATABASE  = module.rds.this_db_instance_name
            PGHOST      = module.rds.this_db_instance_address
            PGPASSWORD  = module.rds.this_db_instance_password
            PGPORT      = module.rds.this_db_instance_port
            PGUSER      = module.rds.this_db_instance_username
        }
    }
}
