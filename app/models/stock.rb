class Stock
  def price
    IEX::Resources::Price.get('AMZN')
  end
end