<?php
function create_database($deviceid,$user_id,$work_path)
{
       global $lang;
       //  這邊再多一個檢查，若是非英文數子的結和，就忽略
       if (!preg_match ('/[^A-Za-z0-9-_]/',$deviceid,$match))
       { 
        $db_name=str_replace('-','_',$deviceid);              
        if (preg_match('/^gsgh-625xt/',$deviceid)){$model='GH-625XT';}
        else if (preg_match('/^gsgb-580p/',$deviceid)){$model='GB-580';}
        else if (preg_match('/^GSGB-1000/',$deviceid)){$model='GB-1000';}
        else if (preg_match('/^gsGH-208/',$deviceid)){$model='GH-208';}
        else if (preg_match('/^GPX_/',$deviceid)){$model='GPX';}
        else if (preg_match('/^GH208gRun-/',$deviceid)){$model='GH208gRun';}
        else {$model='';}

        if ($model !=''){         // 只接受我們家產品，還有基本資料庫防護
          $query_model="select * from tbl_device_model where name='$model'";
          $result=mysql_query($query_model); 
          $row=mysql_fetch_array($result);
          $model_id= $row['id'];

          $db_col="(deviceid,db_name,model,creator)";
          $db_value="('$deviceid','$db_name','$model_id','$user_id')"; 
          $query_add="insert into tbl_device".$db_col. "values".$db_value;
          $result=mysql_query($query_add); 
       // 動態創建各型號資料表    
         if ($result){
           exec ("bash $work_path/sh/create.sh $db_name 2>&1 1> /dev/null ",$bash_return,$status);  
           if ($status ==0){  
              $final="ok";              
           }else {$final=$bash_return[0];}                        
          }else {$final=$lang['error_registrator_database'];}
         }else {$fianl=$lang['error_registrator_uuid'];}
        }else {$fianl=$lang['error_registrator_no_uuid'];}                 
        return $final;
}     

?>


