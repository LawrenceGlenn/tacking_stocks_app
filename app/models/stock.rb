class Stock
  attr_reader :price, :chart
  
  def initialize
    @sym = 'MSFT'
    @price = IEX::Resources::Price.get('MSFT')
    @chart = IEX::Resources::Chart.get('MSFT', 'dynamic')
  end

  def chart_size
    @chart.size
  end


end