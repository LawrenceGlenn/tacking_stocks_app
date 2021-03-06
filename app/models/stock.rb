class Stock
  attr_reader :price, :chart, :news
  
  def initialize(sym = "MSFT")
    @sym = sym
    @price = IEX::Resources::Price.get(sym)
    @chart = IEX::Resources::Chart.get(sym, 'dynamic')
    @company = IEX::Resources::Company.get(sym)
    @news = IEX::Resources::News.get(sym)
  end

  def chart_size
    @chart.size
  end

  def name
    @company.company_name
  end

  def headline
    @news.first.headline
  end

end