"use strict";angular.module("webAppApp",["ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ui.grid","ui.grid.edit","ui.grid.pagination","textAngular","ui.select","angularFileUpload","ui.bootstrap","ngclipboard"]).config(["$routeProvider",function(a){var b=function(a,b,c){var d=b.defer();return c.authorized().then(function(b){b?d.resolve():(d.reject(),a.url("/login"))}),d.promise};b.$inject=["$location","$q","api"],a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main",resolve:{loggedIn:b}}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about",resolve:{loggedIn:b}}).when("/grid/:table",{templateUrl:"views/grid.html",controller:"GridCtrl",controllerAs:"grid",resolve:{loggedIn:b}}).when("/detail/:table",{templateUrl:"views/detail.html",controller:"DetailCtrl",controllerAs:"detail",resolve:{loggedIn:b}}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl",controllerAs:"login"}).when("/administration",{templateUrl:"views/administration.html",controller:"AdministrationCtrl",controllerAs:"administration",resolve:{loggedIn:b}}).when("/storage",{templateUrl:"views/storage.html",controller:"StorageCtrl",controllerAs:"storage",resolve:{loggedIn:b}}).otherwise({redirectTo:"/",resolve:{loggedIn:b}})}]),angular.module("webAppApp").controller("MainCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("webAppApp").controller("AboutCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("webAppApp").controller("GridCtrl",["$scope","$routeParams","$location","api","uiGridConstants",function(a,b,c,d,e){function f(a){return!!a.showInGrid&&!a.reference}function g(a){var b={name:a.title,field:a.name};return a.type==k.Boolean&&(b.type="boolean",b.cellTemplate='<input type="checkbox" disabled ng-model="row.entity[\''+b.name+"']\" />"),a.type==k.Date&&(b.type="date",b.cellFilter='date:"yyyy-MM-dd"',b.filter={condition:e.filter.STARTS_WITH,placeholder:"starts with"}),b}function h(){var c=b.table;d.getTable(c).then(function(b){a.table=b,a.filter.tableName=b.name,a.gridOptions.columnDefs=b.columns.filter(f).map(g);var c=b.columns.filter(function(a){return!!a.reference});c&&c.forEach(function(b){if(b.showInGrid){var c={name:b.title,field:b.reference.table+"_"+b.reference.textColumn};a.gridOptions.columnDefs.push(c)}});var d={name:"",field:"buttons",cellEditableCondition:!1,enableSorting:!1,enableHiding:!1,enableColumnMenu:!1,width:65,cellTemplate:'                      <div class="ui-grid-cell-contents ng-binding ng-scope">                        <button class="btn btn-info btn-xs" ng-click="grid.appScope.edit($event, row)"><span class="glyphicon glyphicon-pencil"></span></button>                        <button class="btn btn-danger btn-xs" ng-click="grid.appScope.delete($event, row)"><span class="glyphicon glyphicon-trash"></span></button>                      </div>'};a.gridOptions.columnDefs.push(d),i()})}function i(){switch(j.sort){case e.ASC:a.filter.sortOrder=0;break;case e.DESC:a.filter.sortOrder=1;break;default:a.filter.sortOrder=-1}a.filter.pageSize=a.gridOptions.paginationPageSize,a.filter.currentPage=a.gridOptions.paginationCurrentPage,a.filter.sortColumn=j.sortField,a.loading=!0,d.select(a.filter).then(function(b){a.gridOptions.totalItems=b.totalItemsCount,a.gridOptions.data=b.items,a.loading=!1})}var j={pageNumber:1,pageSize:5,sort:null},k={Text:10,Email:11,Url:12,Phone:13,HTML:14,Password:15,Date:20,Time:21,DateTime:22,File:30,Integer:40,Double:50,Image:60,Binary:70,Lookup:80,Boolean:90};a.loading=!1,a.gridOptions={enableSorting:!0,paginationPageSizes:[10,20,30,50,75,100],paginationPageSize:10,useExternalPagination:!0,useExternalSorting:!0,columnDefs:[],data:[],onRegisterApi:function(b){a.gridApi=b,a.gridApi.core.on.sortChanged(a,function(a,b){0==b.length?j.sort=null:(j.sortField=b[0].colDef.field,j.sort=b[0].sort.direction),i()}),b.pagination.on.paginationChanged(a,function(a,b){j.pageNumber=a,j.pageSize=b,i()})}},a.filter={pageSize:10,sortOrder:1,sortColumn:"",currentPage:1,parameters:[],tableName:"",detailMode:!1},a["delete"]=function(b,c){var e=confirm("Are you sure that you want to permanently delete the selected record?");1==e&&d["delete"](a.table,c.entity).then(function(){"/grid/"+a.table.name;i()})},a.edit=function(d,e){var f=a.table.columns.filter(function(a,b){return 1==a.isKey}),g={};f.forEach(function(a){g[a.name]=e.entity[a.name]},this);var h="/detail/"+b.table;c.path(h).search(g)},a.createNew=function(){var a="/detail/"+b.table;c.path(a).search({"new":!0})},h()}]),angular.module("webAppApp").controller("DetailCtrl",["$scope","$routeParams","$location","api",function(a,b,c,d){function e(){var b="/grid/"+a.table.name;c.path(b).search()}function f(){var c=b.table;d.getTable(c).then(function(c){if(a.table=c,b["new"])return void(a.record={});var e={TableName:c.name,DetailMode:!0,Parameters:b};a.loading=!0,d.select(e).then(function(b){var c=b?b.items[0]:null,d=20;a.table.columns.forEach(function(a){a.type==d&&(c[a.name]=new Date(c[a.name]))}),a.record=c,a.loading=!1})})}a.table={},a.record={},a.loading=!1,a.editorForm={},a.cancel=e,a.save=function(){var c=!b["new"];c?d.update(a.table,a.record).then(e):d.insert(a.table,a.record).then(e)},f()}]),angular.module("webAppApp").controller("LoginCtrl",["$scope","$rootScope","$location","api",function(a,b,c,d){a.incorrectCredential=!1,a.auth=function(){d.signIn(a.username,a.password).then(function(d){d?(a.incorrectCredential=!1,c.path("/").search(),b.$emit("reload",!0)):a.incorrectCredential=!0})}}]),angular.module("webAppApp").controller("StorageCtrl",["$scope","FileUploader","api",function(a,b,c){}]),angular.module("webAppApp").controller("AdministrationCtrl",["$scope","api",function(a,b){a.progress=!1,a.rebuildSchema=function(){a.progress=!0,b.rebuildSchema().then(function(){a.progress=!1,a.status="Database schema updated successfully"})},a.restart=function(){a.progress=!0,b.restart().then(function(){a.progress=!1,a.status="Web application restarted successfully"})},a.refreshPage=function(){location.reload()}}]),angular.module("webAppApp").service("api",["$http",function(a){this.Endpoint="http://x.mh.agi.net.ua/api",this.tokenKey="scaffolder-access-token",this.authorized=function(){return a({url:this.Endpoint+"/Database",method:"GET",headers:{Authorization:"Bearer "+this.getToken()}}).then(function(a){return!0},function(a){return!1})},this.setToken=function(b){localStorage[this.tokenKey]=b,a.defaults.headers.common.Authorization="Bearer "+b},this.getToken=function(){var a=localStorage[this.tokenKey];return"null"==a?null:a},this.signOut=function(){this.setToken("")},this.restart=function(){return this.execute("GET","/system/restart")},this.signIn=function(b,c){var d={username:b,password:c},e=this;return a({method:"POST",url:e.Endpoint+"/token",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:d,transformRequest:function(a){var b=[];for(var c in a)b.push(encodeURIComponent(c)+"="+encodeURIComponent(a[c]));return b.join("&")}}).then(function(a){var b=a.data.access_token;return e.setToken(b),b},function(a){return e.setToken(""),null})},this.execute=function(b,c,d){var e=this,f=e.Endpoint+c;d=$.isEmptyObject(d)?null:d,"POST"==b&&(d=d?JSON.stringify(d):d);var g=null,h=null;return"GET"==b?h=d:g=d,a({url:f,method:b,data:g,params:h,processData:!0,contentType:!1,headers:{Authorization:"Bearer "+e.getToken(),"Content-Type":"application/json"}}).then(function(a){return a.data},function(a){return null})},this.getSchema=function(){return this.execute("GET","/table")},this.getStorageEndpoint=function(){return this.Endpoint+"/files"},this.rebuildSchema=function(){return this.execute("POST","/database")},this.getTable=function(a){return this.execute("GET","/table/"+a)},this.select=function(a){return this.execute("GET","/data/"+name,a)},this.insert=function(a,b){var c={tableName:a.name,entity:b};return this.execute("POST","/data",c)},this.update=function(a,b){var c={tableName:a.name,entity:b};return this.execute("PUT","/data",c)},this["delete"]=function(a,b){var c={tableName:a.name,entity:b};return this.execute("DELETE","/data",c)}}]),angular.module("webAppApp").directive("navigation",function(){return{templateUrl:"views/directives/navigation.html",scope:{ngModel:"=",ngDisabled:"="},restrict:"E",link:function(a,b,c){},controller:["$scope","$rootScope","api",function(a,b,c){function d(){c.authorized().then(function(b){a.authorized=b}),c.getSchema().then(function(b){b&&(a.tables=b.filter(function(a){return!!a.showInList}))})}a.authorized=!1,b.$on("reload",function(a,b){d()}),d()}]}}),angular.module("webAppApp").directive("textEditor",["$compile",function(a){return{template:'<input ng-required="ngRequired" maxlength="{{maxLength}}" ng-disabled="ngDisabled" type="text" class="form-control" ng-model="ngModel" />',scope:{ngModel:"=",ngDisabled:"=",maxLength:"="},restrict:"E",link:function(a,b,c){}}}]),angular.module("webAppApp").directive("emailEditor",function(){return{template:'<input  ng-required="ngRequired" ng-disabled="ngDisabled" type="email" class="form-control" ng-model="ngModel" />',scope:{ngModel:"=",ngDisabled:"="},restrict:"E",link:function(a,b,c){}}}),angular.module("webAppApp").directive("urlEditor",function(){return{template:'<input ng-required="ngRequired" ng-disabled="ngDisabled" type="url" class="form-control" ng-model="ngModel" />',scope:{ngModel:"=",ngDisabled:"="},restrict:"E",link:function(a,b,c){}}}),angular.module("webAppApp").directive("phoneEditor",function(){return{template:'<input  ng-required="ngRequired" ng-disabled="ngDisabled" type="date" class="form-control" ng-model="ngModel" />',scope:{ngModel:"=",ngDisabled:"="},restrict:"E",link:function(a,b,c){}}}),angular.module("webAppApp").directive("htmlEditor",function(){return{template:'<div  ng-disabled="ngDisabled" text-angular ng-model="ngModel"></div>',scope:{ngModel:"=",ngDisabled:"="},restrict:"E",link:function(a,b,c){}}}),angular.module("webAppApp").directive("dateEditor",function(){return{template:'<input ng-required="ngRequired" ng-disabled="ngDisabled" type="date" class="form-control" ng-model="ngModel" />',scope:{ngModel:"=",ngDisabled:"="},restrict:"E",link:function(a,b,c){}}}),angular.module("webAppApp").directive("dateTimeEditor",function(){return{template:'<input ng-required="ngRequired" ng-disabled="ngDisabled" type="datetime" class="form-control" ng-model="ngModel" />',scope:{ngModel:"=",ngDisabled:"="},restrict:"E",link:function(a,b,c){}}}),angular.module("webAppApp").directive("fileEditor",function(){return{template:'<input  ng-required="ngRequired" ng-disabled="ngDisabled" type="file" class="form-control" ng-model="ngModel" />',scope:{ngModel:"=",ngDisabled:"=",filesLocationUrl:"=",filesUploadUrl:"="},restrict:"E",link:function(a,b,c){},controller:["$scope","api",function(a,b){a.imageUrl=a.staticFilesLocationUrl+a.ngModel}]}}),angular.module("webAppApp").directive("integerEditor",function(){return{template:'<input  ng-required="ngRequired" ng-disabled="ngDisabled" type="number" class="form-control" ng-model="ngModel" />',scope:{ngModel:"=",ngDisabled:"="},restrict:"E",link:function(a,b,c){}}}),angular.module("webAppApp").directive("lookupEditor",function(){return{template:'<input  validator="{{validatorRules}}" ng-required="ngRequired" maxlength="maxLength" ng-disabled="ngDisabled" type="text" class="form-control" ng-model="ngModel" />',scope:{ngModel:"=",ngDisabled:"=",maxLength:"=",validatorRules:"="},restrict:"E",link:function(a,b,c){}}}),angular.module("webAppApp").directive("imageEditor",function(){return{templateUrl:"views/directives/imageEditor.html",scope:{ngModel:"=",ngDisabled:"=",filesLocationUrl:"=",filesUploadUrl:"="},restrict:"E",link:function(a,b,c){},controller:["$scope","api","FileUploader",function(a,b,c){function d(a){return!!a&&a.indexOf("http")>-1}var e=new c({url:b.getStorageEndpoint(),removeAfterUpload:!0,autoUpload:!0});a.uploader=e,a.showProgress=!1,e.onBeforeUploadItem=function(){a.showProgress=!0},e.onAfterAddingFile=function(){e.queue[e.queue.length-1].headers.Authorization="Bearer "+b.getToken()},e.filters.push({name:"customFilter",fn:function(a,b){return this.queue.length<10}}),e.onErrorItem=function(){a.uploadedFileUrl=""},e.onCompleteItem=function(b,c){a.ngModel=c.name,a.showProgress=!1},a.$watch("ngModel",function(c,e){c!=e&&(a.imageUrl=d(a.ngModel)?a.ngModel:b.getStorageEndpoint()+"?name="+a.ngModel)})}]}}),angular.module("webAppApp").directive("binaryEditor",function(){return{template:"<div></div>",scope:{ngModel:"=",ngDisabled:"="},restrict:"E",link:function(a,b,c){b.text("this is the BinaryEditor directive")}}}),angular.module("webAppApp").directive("timeEditor",function(){return{template:'<input  ng-required="ngRequired" ng-disabled="ngDisabled" type="time" class="form-control" ng-model="ngModel" />',scope:{ngModel:"=",ngDisabled:"="},restrict:"E",link:function(a,b,c){}}}),angular.module("webAppApp").directive("passwordEditor",function(){return{template:'<input  ng-required="ngRequired" ng-disabled="ngDisabled" type="password" class="form-control" ng-model="ngModel" />',scope:{ngModel:"=",ngDisabled:"="},restrict:"E",link:function(a,b,c){}}}),angular.module("webAppApp").directive("referenceEditor",function(){return{template:'<ui-select ng-model="$parent.selectedItem">                      <ui-select-match>                          <span ng-bind="$select.selected.name"></span>                      </ui-select-match>                      <ui-select-choices repeat="item in (itemArray | filter: $select.search) track by item.id">                          <span ng-bind="item.name"></span>                      </ui-select-choices>                  </ui-select>',scope:{ngModel:"=",ngDisabled:"=",keyColumn:"=",displayColumn:"=",table:"="},restrict:"E",link:function(a,b,c){},controller:["$scope","api",function(a,b){function c(){if(a.itemArray){var b=a.itemArray.filter(function(b){return b.id==a.ngModel});a.selectedItem=b?b[0]:null}}a.selectedItem=null;var d={pageSize:null,sortOrder:1,sortColumn:"",currentPage:1,parameters:[],tableName:a.table,detailMode:!1};b.select(d).then(function(b){a.itemArray=b.items.map(function(b){return{id:b[a.keyColumn],name:b[a.displayColumn]}}),c()}),a.$watch("selectedItem",function(b,c){b!=c&&(a.ngModel=a.selectedItem.id)}),a.$watch("ngModel",function(a,b){a!=b&&c()})}]}}),angular.module("webAppApp").directive("booleanEditor",function(){return{template:'<div class="form-control">                          <input ng-required="ngRequired" ng-disabled="ngDisabled" type="checkbox" ng-model="ngModel" />                       </div>',scope:{ngModel:"=",ngDisabled:"=",maxLength:"="},restrict:"E",link:function(a,b,c){}}}),angular.module("webAppApp").directive("editor",function(){var a={Text:10,Email:11,Url:12,Phone:13,HTML:14,Password:15,Date:20,Time:21,DateTime:22,File:30,Integer:40,Double:50,Image:60,Binary:70,Lookup:80,Boolean:90};return{templateUrl:"views/directives/editor.html",restrict:"E",scope:{ngModel:"=",type:"=",minValue:"=",maxValue:"=",maxLenght:"=",ngDisabled:"=",ngRequired:"=",validatorRules:"=",keyColumn:"=",displayColumn:"=",table:"="},link:function(a,b,c){},controller:["$scope","api",function(b,c){b.columnType=a}]}}),angular.module("webAppApp").directive("fileUploadDialog",["$uibModal",function(a){return{templateUrl:"views/directives/fileUploadDialog.html",restrict:"E",link:function(a,b,c,d){},controller:["$scope","$uibModal","FileUploader","api",function(a,b,c,d){a.uploadedFileUrl="",a.showFileUploadDialog=function(){var c=a;b.open({templateUrl:"fileUploadModalDialog.html",animation:!1,size:"md",scope:c})}}]}}]),angular.module("webAppApp").directive("navbar",function(){return{templateUrl:"views/directives/navbar.html",restrict:"E",link:function(a,b,c){},controller:["$scope","$rootScope","api",function(a,b,c){function d(){c.authorized().then(function(b){a.authorized=b})}a.authorized=!1,b.$on("reload",function(a,b){d()}),d()}]}}),angular.module("webAppApp").directive("fileUpload",function(){return{templateUrl:"views/directives/fileUpload.html",restrict:"E",link:function(a,b,c){},scope:{},controller:["$scope","$uibModal","FileUploader","api",function(a,b,c,d){a.showProgress=!1,a.uploadedFileUrl="",a.uploadedFileName="";var e=new c({url:d.getStorageEndpoint(),removeAfterUpload:!0,autoUpload:!0});a.uploader=e,e.filters.push({name:"customFilter",fn:function(a,b){return this.queue.length<10}}),e.onBeforeUploadItem=function(b){a.showProgress=!0},e.onAfterAddingFile=function(a){e.queue[e.queue.length-1].headers.authorization="Bearer "+d.getToken()},e.onErrorItem=function(b,c,d,e){a.uploadedFileUrl="",a.uploadedFileName=""},e.onCompleteItem=function(b,c,d,e){a.uploadedFileUrl=c.url,a.uploadedFileName=c.name,a.showProgress=!1}}]}}),angular.module("webAppApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/administration.html",'<h3>Administration</h3> <input type="button" ng-disabled="!!progress" class="btn btn-default" value="Rebuild DB Scheme" ng-click="rebuildSchema()"> <input type="button" ng-disabled="!!progress" class="btn btn-default" value="Restart web application" ng-click="restart()"> <div class="loading-bar-container"> <div ng-show="!!progress" class="loading-bar"></div> </div> <div ng-show="!!status" class="alert alert-success" role="alert"> {{status}}&nbsp;<input value="OK" class="btn btn-default" ng-click="refreshPage()" type="button"> </div>'),a.put("views/detail.html",'<h3>{{table.title}}</h3> <form class="form" name="editorForm"> <input type="button" class="btn btn-success btn-details" ng-click="save()" value="Save" ng-disabled="!editorForm.$valid"> <input type="button" class="btn btn-default btn-details" ng-click="cancel()" value="Cancel"> <div class="loading-bar-container"> <div ng-show="!!loading" class="loading-bar"></div> </div> <div ng-repeat="c in table.columns" class="form-group"> <label>{{c.title}}</label> <editor ng-required="c.isNullable" type="c.type" max-lenght="c.maxLength" ng-disabled="!!c.readonly" ng-model="record[c.name]" table="c.reference.table" key-column="c.reference.keyColumn" display-column="c.reference.textColumn"> </editor> </div> <input type="button" class="btn btn-success btn-details" ng-click="save()" value="Save" ng-disabled="!editorForm.$valid"> <input type="button" class="btn btn-default btn-details" ng-click="cancel()" value="Cancel"> </form>'),a.put("views/directives/editor.html",'<div ng-switch on="type"> <binary-editor ng-required="ngRequired" ng-disabled="ngDisabled" ng-model="$parent.ngModel" ng-if="type == columnType.Binary"></binary-editor> <date-editor ng-required="ngRequired" ng-disabled="ngDisabled" ng-model="$parent.ngModel" ng-if="type == columnType.Date"></date-editor> <time-editor ng-required="ngRequired" ng-disabled="ngDisabled" ng-model="$parent.ngModel" ng-if="type == columnType.Time"></time-editor> <date-time-editor ng-required="ngRequired" ng-disabled="ngDisabled" ng-model="$parent.ngModel" ng-if="type == columnType.DateTime"></date-time-editor> <double-editor ng-required="ngRequired" ng-disabled="ngDisabled" ng-model="$parent.ngModel" ng-if="type == columnType.Double"></double-editor> <email-editor ng-required="ngRequired" ng-disabled="ngDisabled" ng-model="$parent.ngModel" ng-if="type == columnType.Email"></email-editor> <file-editor ng-required="ngRequired" ng-disabled="ngDisabled" ng-model="$parent.ngModel" ng-if="type == columnType.File"></file-editor> <html-editor ng-required="ngRequired" ng-disabled="ngDisabled" ng-model="$parent.ngModel" ng-if="type == columnType.HTML"></html-editor> <image-editor ng-required="ngRequired" ng-disabled="ngDisabled" ng-model="$parent.ngModel" ng-if="type == columnType.Image"></image-editor> <integer-editor ng-required="ngRequired" ng-disabled="ngDisabled" ng-model="$parent.ngModel" ng-if="type == columnType.Integer"></integer-editor> <phone-editor ng-required="ngRequired" ng-disabled="ngDisabled" ng-model="$parent.ngModel" ng-if="type == columnType.Phone"></phone-editor> <url-editor ng-required="ngRequired" ng-disabled="ngDisabled" ng-model="$parent.ngModel" ng-if="type == columnType.Url"></url-editor> <password-editor ng-required="ngRequired" ng-disabled="ngDisabled" ng-model="$parent.ngModel" ng-if="type == columnType.Password"></password-editor> <boolean-editor ng-required="ngRequired" ng-disabled="ngDisabled" ng-model="$parent.ngModel" ng-if="type == columnType.Boolean"></boolean-editor> <text-editor ng-required="ngRequired" ng-disabled="ngDisabled" ng-model="$parent.ngModel" ng-if="type == columnType.Text" max-length="$parent.maxLenght"></text-editor> <reference-editor ng-required="ngRequired" ng-disabled="ngDisabled" ng-model="$parent.ngModel" ng-if="type == columnType.Lookup" table="table" key-column="keyColumn" display-column="displayColumn"></reference-editor> </div>'),a.put("views/directives/fileUpload.html",'<input type="file" nv-file-select="" uploader="uploader"> <br> <div class="input-group" style="margin-top: 50px"> <span class="input-group-addon" id="basic-addon1"> <span class="glyphicon glyphicon-paperclip"></span> </span> <input id="url" type="text" class="form-control" placeholder="Uploaded file url" ng-model="uploadedFileUrl"> <span class="input-group-btn"> <button ng-disabled="!uploadedFileUrl" class="btn btn-secondary" type="button" ngclipboard data-clipboard-action="cut" data-clipboard-target="#url"> <i class="glyphicon glyphicon-copy"></i> Copy to clipboard </button> </span> </div> <div class="loading-bar-container"> <div ng-show="!!showProgress" class="loading-bar"></div> </div>'),a.put("views/directives/fileUploadDialog.html",'<script type="text/ng-template" id="fileUploadModalDialog.html"><div class="modal-header">\n        <h3 class="modal-title" id="modal-title">Upload file</h3>\n    </div>\n    <div class="modal-body" id="modal-body" nv-file-drop="" uploader="uploader" filters="queueLimit, customFilter">\n        <file-upload ng-model="uploadedFileUrl"></file-upload>\n\n        <div class="modal-footer">\n            <button class="btn btn-primary" type="button" style="width: 150px;" ng-click="$close()">OK</button>\n        </div></script> <button type="button" class="btn-header" ng-click="showFileUploadDialog()"> <i class="fa fa-upload"></i> Upload file </button>'),a.put("views/directives/imageEditor.html",'<div> <div class="progress" ng-show="showProgress" style="margin-top: 10px"> <div class="progress-bar" role="progressbar" ng-style="{ \'width\': uploader.progress + \'%\' }"></div> </div> <input type="file" nv-file-select="" uploader="uploader"> <br> <img ng-src="{{imageUrl}}" style="max-width: 200px" class="img-resposnsive"> </div>'),a.put("views/directives/navbar.html",'<!-- Header Navbar --> <nav class="navbar navbar-static-top" role="navigation" ng-show="authorized"> <!-- Sidebar toggle button--> <span class="sidebar-toggle" data-toggle="offcanvas" role="button"> <span class="sr-only">Toggle navigation</span> </span> <div class="navbar-custom-menu"> <ul class="nav navbar-nav"> <li> <file-upload-dialog></file-upload-dialog> </li> <li> <input type="button" class="btn-header" value="Logout" ng-click="logout()"> </li> </ul> </div> </nav>'),a.put("views/directives/navigation.html",'<!-- Sidebar Menu --> <ul class="sidebar-menu" ng-show="authorized"> <li class="header">Menu</li> <li><a href="/#/"><i class="fa fa-home"></i> <span>Home</span></a></li> <li><a href="/#/administration"><i class="fa fa-sliders"></i> <span>Administration</span></a></li> <li><a href="/#/storage"><i class="fa fa-upload"></i> <span>Upload file</span></a></li> </ul> <ul class="sidebar-menu" ng-show="authorized"> <li class="header">Tables</li> </ul> <!-- /.sidebar-menu --> <ul class="sidebar-menu" ng-show="authorized"> <li ng-repeat="t in tables"> <a href="/#/grid/{{t.name}}"><i class="fa fa-table"></i> <span>{{t.title}}</span></a> </li> </ul>'),a.put("views/grid.html",'<h3>{{table.title}}</h3> <div style="margin-bottom: 10px"> <i>{{table.description}}</i> </div> <div class="loading-bar-container"> <div ng-show="!!loading" class="loading-bar"></div> </div> <input type="button" class="btn btn-success" ng-click="createNew()" value="Create New"> <br> <br> <div id="grid" ng-disabled="!!loading" class="data-grid" ui-grid="gridOptions" external-scopes="clickHandler" ui-grid-resize-columns ui-grid-pagination class="grid"> </div>'),a.put("views/login.html",'<div class="loginmodal-container"> <h1>Login to Your Account</h1><br> <form> <input class="form-control" type="text" name="user" placeholder="Username" ng-model="username"> <input class="form-control" type="password" name="pass" placeholder="Password" ng-model="password"> <input type="submit" name="login" class="btn btn-primary login loginmodal-submit" value="Login" ng-click="auth()"> <div class="alert alert-danger" ng-show="incorrectCredential"> <strong>Authoization!</strong> Incorrect login or password </div> </form> </div>'),a.put("views/main.html","Welcome to Scaffolder data manager system!<!--<file-upload-dialog></file-upload-dialog>-->"),a.put("views/storage.html",'<h3>Upload file</h3> <div class="row"> <div class="col-md-12"> <file-upload></file-upload> </div> </div>')}]);