Rails.application.routes.draw do
  root :to => 'stocks#index'
  get '/stocks', to: 'stocks#index'
  get '/stocks/:id', to: 'stocks#show'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
