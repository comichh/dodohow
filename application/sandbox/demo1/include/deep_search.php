<div id="DeepSearch" >
	  <table width="100%" style='padding:10px;color:white'>
				<tr>
			  <td ><?php  echo $lang['total_distance']; ?></td>
   <td>
   <div  id="slider-range_2"></div>	
            <div id="amount_2" style="color:white; font-weight:bold;"></div>	
   </td>
				</tr>
				<tr>
					<td>
						<?php echo $lang['total_time'] ?>
					</td>
					<td>	
 <div id="slider-range-max"></div>
             <div type="text" id="amount_1" style="color:white; font-weight:bold;"></div>	


	</td>
				</tr>
				<tr><td><?php echo $lang['FilterUser'] ?></td><td width="65%"><input type="text" id="SearchByName" /></td></tr>
				<tr>
					<td><?php echo $lang['sport_type'] ?></td><td>
						<select id="SportType" >
							<option value="0"><?php echo $lang['all_select'] ?></option>
							<option value="1"><?php echo $lang['run'] ?></option>
							<option value="2"><?php echo $lang['bicycle'] ?></option>
						</select>
					</td>
				</tr>
				<tr><td><?php echo $lang['sport_info'] ?> </td><td><input type="text" id="SearchByKeyword"  /></td></tr>
				<tr><td><?php echo $lang['start_time'] ?></td>
					<td>
						<div id="datetimepicker1" class="input-append date">
							<input id="date_start" type="text" ></input>
						</div>
					</td>
				</tr>
				<tr><td><?php echo $lang['end_time'] ?></td>
					<td>
					  <div id="datetimepicker2" class="input-append date">
						<input id="date_end" type="text" ></input>
					  </div>
					</td>
				</tr>
		
				<tr><td height="30"><?php echo $lang['FilterPhotos'] ?></td>
					<td>
						<input id="PhotoExist" type="radio" name="PhotoExist" value="0" checked /><?php echo $lang['all_select'] ?>
						<input id="PhotoExist" type="radio" name="PhotoExist" value="1" /><?php echo $lang['syes'] ?>
						<input id="PhotoExist" type="radio" name="PhotoExist" value="2" /><?php echo $lang['sno'] ?>
					</td>
				</tr>
				<tr><td height="30"><?php echo $lang['SectionsDifficulty'] ?></td>
					<td>
						<select name='Difficulty[]'>
<option value='0'><?php echo $lang['select']?> </option>
<option>0.5</option>
<option>1</option>
<option>1.5</option>
<option>2</option>
<option>2.5</option>
<option>3</option>
<option>3.5</option>
<option>4</option>
<option>4.5</option>
<option>5</option>
</select>
					</td>
				</tr>
				<tr><td colspan=2  style='text-align:center;'>
         <br>
         <span id="FindByFilter" class='button_css3'><?php echo $lang['search']?></span>
         <!--
         <img id="FindByFilter" src="./images/ok.png" style="cursor:pointer"/>
          -->
       </td></tr>
			</table>

	</div>
<!--   end  -->

	<div id="SortCollection" >
	<table style="padding:10px;color:white">       
				<tr><td ><input type="radio" name="SortType" value="1" checked /></td><td><?php echo $lang['SortByPostTime'] ?></td></tr>
				<tr><td ><input type="radio" name="SortType" value="2" /></td><td><?php echo $lang['SortBySportTime']   ?></td></tr>
				<tr><td ><input type="radio" name="SortType" value="3" /></td><td><?php echo $lang['SortByCommentsCount'] ?></td></tr>
				<tr><td ><input type="radio" name="SortType" value="4" /></td><td><?php echo $lang['SortByPraiseCount'] ?></td></tr>
				<tr><td ><input type="radio" name="SortType" value="5" /></td><td><?php echo $lang['SortByCollectionsCount'] ?></td></tr>
				<tr><td colspan=2  style='text-align:center;'>   
            <span id="reSort" class='button_css3'><?php echo $lang['submit']?></span>      
         </td></tr>
	</table>
	</div>
<!--   end  -->

