<% _.each(api,function(resource) { %> 

	<%=resource.name%> 
	<%=resource.description%> 

	<% _.each(resource.resource,function(route,key) { %> 
		<%=key%>
		<%=route.description%>
	<% }); %>

<% }); %>