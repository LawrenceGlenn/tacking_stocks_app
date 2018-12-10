require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)
module TrackingStocksApp
  class Application < Rails::Application
    config.assets.paths << Rails.root.join("data")
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    

    #include error module on startup
    include Error::ErrorHandler
  end
end
