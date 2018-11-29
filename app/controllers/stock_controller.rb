class StockController < ApplicationController
  def index
    @stocks = Stock.new
  end

  def show
  end

  def new
    @stock = Stock.new
    if request.xhr?
      respond_to do |format|
        format.json {
          render json: {stocks: @stocks}
        }
        rescure StandardError => e
        render json: {errors: e.message}, status: :unprocessable_entity
      end
    end
  end

end
