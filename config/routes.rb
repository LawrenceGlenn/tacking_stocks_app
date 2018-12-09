Rails.application.routes.draw do

  #Serve websocket cable requests in-process
  mount ActionCable.server => '/cable'
  
  root :to => 'stock#index'
  get '/stocks', to: 'stock#index'
  get '/stock/:id', to: 'stock#show'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
