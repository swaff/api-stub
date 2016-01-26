require "sinatra"
require "sinatra/config_file"
require_relative "./lib/response_file"
require_relative "./lib/response_code"

config_file "./config.yml"

def get_response(response_file, code = 200)
  if response_file.exists?
    [code, File.read(response_file.name)]
  else
    [404, "No file found at #{response_file.name}"]
  end
end

def response_file(request, settings)
  ResponseFile.new(request.path, request.params, settings.ignored_params)
end

get '/' do
  erb :index
end

get "/api/*" do |path|
  get_response(response_file(request, settings))
end

post "/api/*" do
  response_code = ResponseCode.new request.params
  get_response(response_file(request, settings), response_code.code)
end
