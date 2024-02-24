
# Queue to send found events from lister to scraper
resource "random_id" "events_queue" {
  byte_length = 4
}
resource "cloudflare_queue" "events_queue" {
  name       = "run5-api-${var.env}-events-queue-${random_id.events_scraper.hex}"
  account_id = local.account_id
}

# Reads a json containing all parkrun event locations and sends them to the queue
resource "random_id" "events_lister" {
  byte_length = 4
}
resource "cloudflare_worker_cron_trigger" "events_lister" {
  script_name = cloudflare_worker_script.events_lister
  schedules = ["0 23 * * *"]
  account_id = local.account_id
}
resource "cloudflare_worker_script" "events_lister" {
  name               = "run5-api-${var.env}-events-${random_id.events_lister.hex}"
  content            = file("script.js")
  account_id         = local.account_id
  compatibility_date = "2023-07-01"
  module             = true

  queue_binding {
    binding = "QUEUE_EVENTS"
    queue   = cloudflare_queue.events_queue.id
  }
}

# Takes an event from the queue and scrapes the parkrun website for info, then adds it to KV
# TF doesn't support setting queue consumers so this is done manually after deploy
resource "random_id" "events_scraper" {
  byte_length = 4
}
resource "cloudflare_worker_script" "events_scraper" {
  depends_on = [ cloudflare_queue.events_queue ]

  name               = "run5-api-${var.env}-events-scraper-${random_id.events_scraper.hex}"
  content            = file("${path.root}/../workers/events_scraper/out.js")
  account_id         = local.account_id
  compatibility_date = "2023-07-01"
  module             = true

  kv_namespace_binding {
    name = "KV_EVENT_INFO"
    namespace_id = cloudflare_workers_kv_namespace.event_info.id
  }
}
