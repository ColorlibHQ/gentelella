# Extras

Guides for making the picker work better with rails, IE, etc. **Note:** I have no idea if these guides still apply for v5 or not.

## Rails 3

by [dhulihan](https://github.com/dhulihan)

You can easily override the default rails form helpers (`date_select` and `datetime_select`) with bootstrap-datetimepicker for a much nicer experience. 

```rb
# Add to config/initializers/form.rb or the end of app/helpers/application_helper.rb
module ActionView
  module Helpers
    class FormBuilder 
      def date_select(method, options = {}, html_options = {})
        existing_date = @object.send(method) 
        formatted_date = existing_date.to_date.strftime("%F") if existing_date.present?
        @template.content_tag(:div, :class => "input-group") do    
          text_field(method, :value => formatted_date, :class => "form-control datepicker", :"data-date-format" => "YYYY-MM-DD") +
          @template.content_tag(:span, @template.content_tag(:span, "", :class => "glyphicon glyphicon-calendar") ,:class => "input-group-addon")
        end
      end

      def datetime_select(method, options = {}, html_options = {})
        existing_time = @object.send(method) 
        formatted_time = existing_time.to_time.strftime("%F %I:%M %p") if existing_time.present?
        @template.content_tag(:div, :class => "input-group") do    
          text_field(method, :value => formatted_time, :class => "form-control datetimepicker", :"data-date-format" => "YYYY-MM-DD hh:mm A") +
          @template.content_tag(:span, @template.content_tag(:span, "", :class => "glyphicon glyphicon-calendar") ,:class => "input-group-addon")
        end
      end
    end
  end
end
```

The time format used here is ActiveRecord-friendly, which means it will be parsed correctly when passed in through `params` to your record.

That's all there is to it! Now all of your forms that use `datetime_select` or `date_select` will be automatically updated:

```erb
<% form_for @post do |f| %>
	<div class="form-group">
		<label>Published At</label>
		<%= f.datetime_select :published_at %>
	</div>
<% end %>
```