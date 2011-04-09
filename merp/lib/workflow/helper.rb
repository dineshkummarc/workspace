require 'yaml'

# extend String
String.class_eval do

  def file_name
    file_full_name.split('.')[0]
  end
  def file_full_name
    self.split('/')[-1]
  end

end

module Helper 
  # yaml file handler class
  class Yaml

    PATTERN_DEFAULT = 'workflow-*.yml'
    class << self

      # opts = {:path => '', :pattern => ''}
      def load_path(opts = {})
        wf_map = {}
        Dir.chdir(opts[:path] || Dir.pwd) do
          # Dir.glob("#{opts[:path] || Dir.pwd}../**/#{ opts[:pattern] || PATTERN_DEFAULT }").each { | file | wf_map[file.file_name.to_sym] = load_file(file) }
          Dir.glob("**/#{ opts[:pattern] || PATTERN_DEFAULT }").each { | file | wf_map[file.file_name] = load_file(file) }
        end
        wf_map     
      end

      def load_file(filename)
        YAML::load(File.read(filename))
      end

    end

  end
end

# puts Helper::Yaml.load_file('database.yaml')

# puts "rub/ddd/xingzhong/test.yam".file_name
# puts Helper::Yaml.load_path(:path => 'D:\ruby-rails\work\workflow', :pattern => '*.yml');
# puts Dir.pwd
