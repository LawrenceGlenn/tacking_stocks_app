Rails.application.routes.draw do
  root :to => 'stock#index'
  get 'stock/index'

  resources :stocks

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
