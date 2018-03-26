<?php 
//  $navigation=true;
//  $no_check=0;
//  include ("../config/head.php");
//include ("head_config.php");
//include ("../config/mysql.php");
?>

<script>
$(document).ready(function(){
  $("[id^=kill_]").click(function(){ 
    id=$(this).attr("id");      
    $.post('ajax/ajax_kill_blacklist.php', {id:id}, function(data){
       if ( data == 'ok'){
         location.reload(); 
      }else{
        alert (data);
      }  
    });
  });
  $("[id^=update_]").click(function(){ 
    id_update=$(this).attr("id");   
    update_value=$("#descript_"+id_update).val();  
    $.post('ajax/ajax_update_blacklist.php', {id_update:id_update,update_value:update_value}, function(data){
       if (data == "save"){ 
          $("#show_"+id_update).css('color','#009900').html(data+"&nbsp&nbsp&nbsp&nbsp&nbsp"); 
       }else {
          $("#show_"+id_update).css('color','red').html(data+"&nbsp&nbsp&nbsp&nbsp&nbsp"); 
       }
    });
  });

});
</script>
<style>
.join_societies_show {width:100%;margin:0;padding:0px;}
/*
th.join_societies_show {width:10%;height:30px; background-color:#666; color:#fff;text-align:center;border:#000000 1px outset ;padding:0; margin:0;}
th.join_societies_show_1 {width:4%;height:30px; background-color:#666; color:#fff;text-align:center;border:#000000 1px outset ;padding:0; margin:0;}
*/
th.join_societies_show{width:10%}
th.join_societies_show_1 {width:4%;}
td.join_societies_show{width:10%;}
td.join_societies_show_1{width:4%;}


/* span.page {position:absolute;right:0;color:rgb(0,0,153);font-size:16px} */
span.page a{padding:6px;color:rgb(0,0,153);}
span.page a:hover{background-color:yellow;text-decoration:none;}
</style>


    
  
        <?php          
            $page=$_GET['page'];
            $total_num=$_GET['total_num'];
            $per_page_num=20;         // 每頁幾筆
       
            if ($page==''){
              $query="select SQL_CALC_FOUND_ROWS  * from tbl_blacklist where for_me_user_key='$_SESSION[user_id]' LIMIT 0,$per_page_num";
              $result=mysql_query($query);
              $query_total="SELECT FOUND_ROWS()";
              $result_total=mysql_query($query_total); 
              while ($row_total=mysql_fetch_array($result_total))
              {$total_num=$row_total['FOUND_ROWS()']; } 
            }else {
              $start=($page-1)*$per_page_num;
              $query="select * from tbl_blacklist where for_me_user_key='$_SESSION[user_id]' LIMIT $start,$per_page_num";
              $result=mysql_query($query);
            }
            $table="<p><table class='join_societies_show'><tr>";
            $table.="<th class='join_societies_show'>"."$lang[blacklist_2]"."</th>";
            $table.="<th class='join_societies_show'>"."$lang[blacklist_3]"."</th>";
            $table.="<th class='join_societies_show'>"."$lang[blacklist_4]"."</th>";
            $table.="<th class='join_societies_show_1'>"."$lang[kill]"."</th>";
            while ($row=mysql_fetch_array($result))
            {   
              $query="select * from tbl_user where id='$row[for_black_user_key]'";
              $result_1=mysql_query($query); 
              while ($row1=mysql_fetch_array($result_1))
              {
                $table.="<tr>"; 
                $table.="<td class='join_societies_show'>".$row1['displayname']."</td>";
                $table.="<td class='join_societies_show'>";
                $table.="<span id='show_update_$row[id_blacklist]'></span>";
                $table.="<input style='width:50%;' type='text'  id='descript_update_$row[id_blacklist]' value='".$row['black_descript']."'/>";
                $table.="<a id='update_$row[id_blacklist]'  href='#'>&nbsp$lang[edit]&nbsp</a>";
                $table.="</td>";
                $table.="<td class='join_societies_show'>".$row['black_time']."</td>";
                $table.="<td class='join_societies_show_1'>"."<a id='kill_$row[id_blacklist]' href='#'>"."$lang[kill]"."</a>"."</td>"; 
                $table.="</tr> ";
                $table.="<tr><td colspan='4'><hr></td></tr>"; 
              } 
            }
            $table.="</table>";
            // 分頁
            $now_page=$_SERVER['PHP_SELF'];
            $need_page=ceil ($total_num/$per_page_num);       
            $select_page="<span class='page'>";
            for ($i=1;$i<=$need_page;$i=$i+1)
            {
                $select_page.="<a href='$now_page?page=$i&total_num=$total_num'>".$lang['page_1'].$i.$lang['page_2']."</a>|";
            }
            $select_page.="</span>";
            echo  $select_page;
            
             echo $table;
             //echo  "<br>".$select_page;
  
        ?>       

        






