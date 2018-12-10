
module Error
  class StockNotFoundError < CustomError
    def initialize
      super(:stock_not_found, 422, 'Stock not found')
    end
  end
end