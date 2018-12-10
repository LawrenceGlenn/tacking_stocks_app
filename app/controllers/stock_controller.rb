class StockController < ApplicationController
  def index
    @stocks = Stock.new
  end

  def show
    begin
      @stock = Stock.new(params[:id])
    rescue StandardError => e
          render action: "symbolerror"
    end
    if request.xhr?
      respond_to do |format|
        format.json {
          render json: {stock: @stock}
        }
        rescure StandardError => e
        render json: {errors: e.message}, status: :unprocessable_entity
      end
    end
  end

  def symbolerror
  end

end
