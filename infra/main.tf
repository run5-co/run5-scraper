locals {
  account_id = data.cloudflare_zone.run5_zone.account_id
}

data "cloudflare_accounts" "run5_account" {
  name = "Eelviny"
}

resource "cloudflare_r2_bucket" "tfstate" {
  account_id = data.cloudflare_accounts.run5_account.accounts[0].id
  name       = "run5-api-${var.env}-tfstate"
  # lifecycle {
  #   prevent_destroy = true
  # }
}

// Fetch the zone id from the zone name.
data "cloudflare_zone" "run5_zone" {
  account_id = data.cloudflare_accounts.run5_account.accounts[0].id
  name       = "run5.co"
}

resource "cloudflare_zone_settings_override" "run5_zone" {
  zone_id = data.cloudflare_zone.run5_zone.zone_id
  settings {
    always_use_https = "on"
    min_tls_version  = "1.2"
    security_header {
      enabled            = true
      max_age            = 15638400
      include_subdomains = true
      nosniff            = true
      preload            = true
    }
  }
}

resource "cloudflare_zone_dnssec" "run5_zone" {
  zone_id = data.cloudflare_zone.run5_zone.zone_id
}

resource "cloudflare_worker_domain" "run5_domain" {
  zone_id = data.cloudflare_zone.run5_zone.zone_id
  // Define a new Cloudflare Worker domain.
  service = cloudflare_worker_script.index.name
  // Use the zone id from the Cloudflare record.
  account_id = local.account_id
  hostname   = "api${var.env == "prod" ? "" : "-${var.env}"}.${data.cloudflare_zone.run5_zone.name}"

  lifecycle {
    replace_triggered_by = [cloudflare_worker_script.index.name]
  }
}

resource "random_id" "index" {
  byte_length = 4
}
resource "cloudflare_worker_script" "index" {
  name               = "run5-api-${var.env}-index-${random_id.index.hex}"
  content            = file("script.js")
  account_id         = data.cloudflare_zone.run5_zone.account_id
  compatibility_date = "2023-07-01"
  module             = true
}
