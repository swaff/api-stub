class ResponseFile
  attr_reader :request_path, :request_params, :ignored_params

  def initialize (request_path, request_params = {}, ignored_params = [])
    @request_path = clean_path request_path
    @request_params = request_params
    @ignored_params = ignored_params
  end

  def name
    "#{request_path}#{params_path}#{response_file_name}.json".downcase
  end

  def exists?
    File.exists? name
  end

  private

  def params_path
    included_params = request_params.reject { | key | ignored_params.include? key }
    path = included_params.inject([]) { |memo, (key, val)| memo << "#{key}-#{val}" }
      .sort()
      .join("/")
      .gsub(/ /, '')

    path = "params/#{path}/" unless path.empty?
    path
  end

  def response_file_name
    return "index" if request_params.fetch("response_file", "").empty?
    request_params["response_file"]
  end

  def left_trim_slash(request_path)
    request_path.sub(/^\//, "")
  end

  def ensure_trailing_slash(request_path)
    if request_path.end_with? '/'
      return request_path
    end
    "#{request_path}/"
  end

  def clean_path(request_path)
    left_trim_slash(ensure_trailing_slash(request_path))
  end
end
