class Stock
  attr_reader :price, :chart
  
  def initialize(sym = "MSFT")
    @sym = sym
    @price = IEX::Resources::Price.get(sym)
    @chart = IEX::Resources::Chart.get(sym, 'dynamic')
    @company = IEX::Resources::Company.get(sym)
  end

  def chart_size
    @chart.size
  end

  def name
    @company.company_name
  end


end