WORKFLOW_ROOT = "#{File.expand_path('..', __FILE__)}"

require "#{WORKFLOW_ROOT}/helper"

module Os
  @@wf_kv = {}
  @@workflows = {}

  CONFIG_PATH = "#{WORKFLOW_ROOT}/config"
  STATUS_QUEUED   = 'queued'
  STATUS_UNDERWAY = 'underway'
  STATUS_FINISHED = 'finished'
  STATUS_ROLLBACK = 'rollback'

  class << Os
    
    def init
      # load workflow-*.yml files
      config = Helper::Yaml.load_file("#{CONFIG_PATH}/workflow.yml")
      yaml_pattern = config[:workflow] ? config[:workflow][:yaml_pattern] : nil

      index = 0;
      Helper::Yaml.load_path(:path => CONFIG_PATH, :pattern => yaml_pattern).each do |filename, content|
        # puts ":#{filename} => #{content}"
        workflows[filename] = Workflow.new.load(content['workflow'])
        wf_kv[filename] = workflows[filename].name || "workflow-#{index += 1}"
        # puts "wf_kv:::#{wf_kv} \n #{workflows}"
      end
      
    end

    def startup
      init
    end

    def wf_kv
      @@wf_kv
    end
    def workflows
      @@workflows
    end

  end

  class Base
    def initialize(opts = {})
      @name = opts['name'] || ''
      @condition = opts['condition'] || 'true'
      @before_function = opts['before_function'] || ''
      @after_function = opts['after_function'] || ''
    end

    attr_reader :name

    def condition
      @condition && eval(@condition)
    end

    def before_function
      eval(@before_function)
    end

    def after_function
      eval(@after_function)
    end

  end

  class RtBase < Base
     # workflow split
    def initialize(opts = {})
      super
      @results = opts['results'] && opts['results'].re_map { |result| Result.new result }
    end

    def run
      if condition
        before_function
        after_function

        @results.each do |id, result|
          rt = result.run
          return rt if rt
        end
        # @results.find_v { |id, result| result.run }
      end
    end
  end

  class Workflow
    # Os::Workflow
    def initialize
      @name = ''
      @actions = {}
      @steps = {}
      @splits = {}
      @joins = {}
      @curr_step_ids = []
    end

    attr_reader :name

    def load(opts = {})
      @name = opts['name']
      @actions = opts['init_actions'] && opts['init_actions'].re_map { |action| Action.new action } 
      @steps = opts['steps'] && opts['steps'].re_map { |step| Step.new step }
      @splits = opts['splits'] && opts['splits'].re_map { |split| Split.new split }
      @joins = opts['joins'] && opts['joins'].re_map { |join| Join.new join }
      self
    end

    def next_step(step_id)
      @steps[step_id].run
    end

    # result steps {}
    def start_step
      @actions.find_v { |id, action| action.run }
    end
    
  end

  class Action < RtBase
    # workflow action
    def initialize(opts = {})
      super
      @auto = false
    end
  end

  class Step < Base

    # workflow step
    def initialize(opts = {})
      super
      @status = STATUS_QUEUED
      @owner = nil
      @actions = {}
      @actions = opts['actions'] && opts['actions'].re_map { |action| Action.new action }
    end

    def run
     actions
    end

    def actions
      @actions.find_v { |id, action| action.run }
    end

    def queued
      @status = STATUS_QUEUED
    end
    def underway
      @status = STATUS_UNDERWAY
    end
    def finished
      @status = STATUS_FINISHED
    end

  end

  class Result < Base
    # workflow result

    IS_STEP  = 'step'
    IS_SPLIT = 'split'
    IS_JOIN  = 'join'

    def initialize(opts = {})
      super
      @step_id = opts['step']
      @split_id = opts['split']         # 1 > 2
      @join_id = opts['join']           # 2 > 1
      @status = opts['status']
      @owner = opts['owner']
      @type = @step_id and IS_STEP or @split_id and IS_SPLIT or @join_id and IS_JOIN
    end

    attr_reader :status, :owner, :step_id, :split_id, :join_id, :type

    def run
      # result do
      if condition
        self
      else
        false
      end
    end

  end

  class Join < RtBase
    # workflow join
  end

  class Split < RtBase
    # workflow split
  end

end

class Hash

  def find_k
    ret = []
    self.each do |k, v|
      ret << k if yield(k, v)
    end
    ret
  end

  def find_v
    ret = []
    self.each do |k, v|
      r = yield(k, v)
      ret << r if r
    end
    ret
  end

  def re_map
    n_map = {}
    # from an map to other map
    self.each { |k, v| n_map[k] = yield v }
    n_map
  end

end

