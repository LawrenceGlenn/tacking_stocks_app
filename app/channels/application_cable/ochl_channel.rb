class OchlChannel < ApplicationCable::OchlChannel
  def subscribed
    stream_from "ochl_channel"
  end

  def unsubscribed

  end

end