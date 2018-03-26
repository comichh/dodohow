<!DOCTYPE html>
<html lang="en" class="fuelux">
<head>
	<meta charset="utf-8">
	<title>Fuel UX 2</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="com/datagrid/dist/css/fuelux.css" rel="stylesheet">
	<script src="com/datagrid/lib/require.js"></script>
	<script>
		requirejs.config({
			config: {
				moment: {
					noGlobal: true
				}
			},
			paths: {
				jquery: 'com/datagrid/lib/jquery-1.9.1.min',
				underscore: 'com/datagrid/lib/Underscore',
				bootstrap: 'com/datagrid/lib/bootstrap/js',
				fuelux: 'com/datagrid/src',
				moment: 'com/datagrid/lib/moment' // comment out if you dont want momentjs to be default
			}
		});
				
		require(['jquery', 'com/datagrid/rec/data', 'com/datagrid/rec/datasource', 'com/datagrid/rec/datasourceTree', 'fuelux/all'], function ($, sampleData, StaticDataSource, DataSourceTree) {
			var dataSource = new StaticDataSource({
				columns: [
					{
						property: 'name',
						label: '裝置',
						sortable: true
					},
					{
						property: 'countrycode',
						label: '發布時間',
						sortable: true
					},
					{
						property: 'population',
						label: '發布者',
						sortable: true
					},
					{
						property: 'population',
						label: '名稱',
						sortable: true
					},
					{
						property: 'population',
						label: '描述',
						sortable: true
					},
					{
						property: 'population',
						label: '照片',
						sortable: true
					},
					{
						property: 'population',
						label: '總距離',
						sortable: true
					},
					{
						property: 'population',
						label: '總時間',
						sortable: true
					},
					{
						property: 'population',
						label: '開始時間',
						sortable: true
					},
					{
						property: 'fcodeName',
						label: 'Type',
						sortable: true
					}
				],
				data: [

				],
				delay: 250
			});

			$('#MyGrid').datagrid({
				dataSource: dataSource
			});		
        });
	</script>


</head>

<body>

<div class="container">
	<table id="MyGrid" class="table table-bordered datagrid">
		<thead>
		<tr>
			<th>
				<span class="datagrid-header-title">Geographic Data Sample</span>

				<div class="datagrid-header-left">
					<div class="input-append search datagrid-search">
						<input type="text" class="input-medium" placeholder="Search">
						<button class="btn"><i class="icon-search"></i></button>
					</div>
				</div>
				<div class="datagrid-header-right">
					<div class="select filter" data-resize="auto">
						<button data-toggle="dropdown" class="btn dropdown-toggle">
							<span class="dropdown-label"></span>
							<span class="caret"></span>
						</button>
						<ul class="dropdown-menu">
							<li data-value="all" data-selected="true"><a href="#">All</a></li>
							<li data-value="lt5m"><a href="#">Population &lt; 5M</a></li>
							<li data-value="gte5m"><a href="#">Population &gt;= 5M</a></li>
						</ul>
					</div>
				</div>
			</th>
		</tr>
		</thead>

		<tfoot>
		<tr>
			<th>
				<div class="datagrid-footer-left" style="display:none;">
					<div class="grid-controls">
						<span>
							<span class="grid-start"></span> -
							<span class="grid-end"></span> of
							<span class="grid-count"></span>
						</span>
						<div class="select grid-pagesize" data-resize="auto">
							<button data-toggle="dropdown" class="btn dropdown-toggle">
								<span class="dropdown-label"></span>
								<span class="caret"></span>
							</button>
							<ul class="dropdown-menu">
								<li data-value="5" data-selected="true"><a href="#">5</a></li>
								<li data-value="10"><a href="#">10</a></li>
								<li data-value="20"><a href="#">20</a></li>
								<li data-value="50"><a href="#">50</a></li>
								<li data-value="100"><a href="#">100</a></li>
							</ul>
						</div>
						<span>Per Page</span>
					</div>
				</div>
				<div class="datagrid-footer-right" style="display:none;">
					<div class="grid-pager">
						<button type="button" class="btn grid-prevpage"><i class="icon-chevron-left"></i></button>
						<span>Page</span>

						<div class="input-append dropdown combobox">
							<input class="span1" type="text">
							<button class="btn" data-toggle="dropdown"><i class="caret"></i></button>
							<ul class="dropdown-menu"></ul>
						</div>
						<span>of <span class="grid-pages"></span></span>
						<button type="button" class="btn grid-nextpage"><i class="icon-chevron-right"></i></button>
					</div>
				</div>
			</th>
		</tr>
		</tfoot>

	</table>

</div>

</body>
</html>
