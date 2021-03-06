<!DOCTYPE html>
<html>
	<head lang="en">
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'experimentalPlateSet.label', default: 'Experiment')}" />
		<title>Create Assay</title>
	</head>
	<body>
		<div class="content-fluid">
			<div class="row">
				<div class="col-sm-12 content-body">
					<h3 style="margin-left:15px">Create Assay</h3>
					<ol class="breadcrumb">
						<li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
						<li>Create Assay</li>
					</ol>
					<div class="col-sm-12">
						<div id="newAssayPanel" class="panel panel-default">
							<div class="panel-heading">
								<h4 class="panel-title">New Assay</h4>
							</div>
							<div class="panel-body ">
								<g:if test="${flash.message}">
								<div class="message" role="status">${flash.message}</div>
								</g:if>
								<g:hasErrors bean="${experimentalPlateSetInstance}">
								<ul class="errors" role="alert">
									<g:eachError bean="${experimentalPlateSetInstance}" var="error">
									<li <g:if test="${error in org.springframework.validation.FieldError}">data-field-id="${error.field}"</g:if>><g:message error="${error}"/></li>
									</g:eachError>
								</ul>
								</g:hasErrors>
								<g:form url="[resource:experimentalPlateSetInstance, action:'save']" >
									<fieldset class="form">
										<g:render template="form"/>
									</fieldset>
									<fieldset class="buttons col-sm-12">
										<g:submitButton name="create" class="save btn btn-default pull-right" value="${message(code: 'default.button.create.label', default: 'Create')}" />
									</fieldset>
								</g:form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>		
	</body>
</html>
