# This file contains all resources that hold a state, and cannot be lost. Edit with caution.

resource "cloudflare_workers_kv_namespace" "event_info" {
  title = "run5-api-${var.env}-event-info"
  account_id = local.account_id

  lifecycle {
    prevent_destroy = true
  }
}
