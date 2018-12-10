Rails.application.routes.draw do

  root :to => 'stock#index'
  get '/stocks', to: 'stock#index'
  get '/stock/:id', to: 'stock#show'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
