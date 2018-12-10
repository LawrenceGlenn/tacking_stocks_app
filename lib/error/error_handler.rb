module Error
  module ErrorHandler
    def self.included(clazz)
      clazz.class_eval do
        rescue_from CustomError do |e|
          respond(e.error, e.status, e.message)
        end
      end
    end

    private

    def respond(_error, _status, _message)
      json = Helpers::Render.json(_error, _status, _message)
      render json: json
    end
  end
end