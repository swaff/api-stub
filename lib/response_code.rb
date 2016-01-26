class ResponseCode
  attr_reader :params

  def initialize (params = {})
    @params = params
  end

  def code
    code = params.has_key?("response_code") ? params["response_code"].to_i : 200
    code = 200 if code == 0
    code
  end
end
