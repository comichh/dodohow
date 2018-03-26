import java.net.*;
import java.io.*;  
import java.sql.*;
import java.util.*;
import java.util.Date ;
import java.text.*;

    public class ServerSport {  
        public ServerSport() {  
              ServerSocket ss = null;          
            try {  
                ss = new ServerSocket(5017);              
                System.out.println("connect ok");                 
                while(true){  
                    Socket s = ss.accept();  
                     Thread thread=new ServerThread(s);
                     thread.start();
                }  
            } catch (IOException e) {  
                System.err.println("socket error");
                e.printStackTrace();  
            }  
        }          
        public static void main(String[] args) {  
            new ServerSport();  
        }  
    }        
    class ServerThread extends Thread { 
        private Socket s = null;  
        private BufferedReader read = null;  
        private PrintStream print = null;  
        public ServerThread(Socket s) {  
            this.s = s;  
            try { 
                read = new BufferedReader(new InputStreamReader(s.getInputStream()));  
                print = new PrintStream(s.getOutputStream());  
            } catch (IOException e) {  
                e.printStackTrace();  
            }  
        }  
  
  public static String error_log(String message,Statement st, String reason , String query ) {              //錯誤紀錄   
   String query_error="insert tbl_error_log (log,reason,query) values('"+message+"','"+reason+"',\""+query+"\")";
         try{  
           st.executeUpdate(query_error);
         } catch (Exception e) {
           System.out.println("error_input_insert:"+query_error+"\r\n");    
         } 
   return message;
   }


        public void run() {    
            try {  
                String message ="";
                String message1 ="";
                Statement st = null;
                ResultSet rs = null; 
                String need_id= "";
                String imei="";
                String query="";
                String train_id_temp="";
                String  device="";   
                // 625XT, GB-580 , GB-1000 都是這個格式
                String G_625XT_train="deviceid,Start_time,wTotalPoint,lTotalTime,lTotalDistance,wLapCnts,bMultiSport,wCalory,lMaxSpeed,cMaxHeart,cAvgHeart,wAscent,wDescent,sMinAlti,sMaxAlti,wAvgCadns,wBestCadns,wAvgPower,wMaxPower,cSport1,cSport2,cSport3,cSport4,cSport5";              
                String G_625XT_lap="train_data_key,deviceid,start_time,lap_no,total_time,total_distance,calory,maxspeed,max_heart,avg_heart,min_alt,max_alt,avg_cadns,best_cadns,avg_power,max_power,Multi_Sport_Index,start_pt,end_pt";
                String G_625XT_point="train_data_key,start_time,no,latitude,longitude,altitude,speed,heart_rate,cadence,pwr_cadence,power,distance"; 
                String web="127.0.0.1";   
                String open_web="sport4u.pro";      
                try {
                Class.forName("com.mysql.jdbc.Driver");
                Connection ct = DriverManager.getConnection(
           //         "jdbc:mysql://"+web+":3306/sport", "root", "gsdodohow");
                      "jdbc:mysql://"+web+":3306/sport?user=root&password=gsdodohow&useUnicode=true&characterEncoding=utf-8");
                st = ct.createStatement();
                } catch (Exception e) {
                 System.out.println("database connect error");  
                }  


while (!(message = read.readLine()).equals("")){
      //System.out.println(Thread.currentThread().getName());
               String train_id="";
               String lap_id="";
               String point_id="";
               int error_input=0;
                                       
                 System.out.println("get:"+message); 
               // 目前只有環天的機器，整個架構都是以目前環天可用的作法判斷而已
             
                    String[]token=message.split(",");      //原始數據的主分割
                    char  globalsat=token[0].charAt(0);    
                    message1=message.replaceAll(",","','");                              
                 switch(globalsat)
                 {
                    case 'C':                 // 實際分辨是 CR
                     if (message.matches(".*!$")){
                       device=token[1].replaceAll("!","");   
                       query="select * from tbl_device where deviceid='"+device+"'";
                       try {
                        rs = st.executeQuery(query);
                        while(rs.next()){need_id=rs.getString(1);}
                        if (need_id !=""){
                          print.print("ACKCR,0,http://"+open_web+"\r\n");  
                          //System.out.println("ACKCR,0,http://"+open_web+"\r\n");              
                        } else{   // 註冊, 只有這種情況會開啟網站  
                          print.print("ACKCR,1,http://"+open_web+"/registrator.php?device="+device+"\r\n");
                          //System.out.println("ACKCR,1,http://"+open_web+"/registrator.php?device="+device+"\r\n");                         
                        }  
                       } catch (Exception e) {                      
                          error_log(message,st,"檢查 device 存在錯誤",query);
                       }
                     }                       
                    break; 
                    case '@':            // train data                                     
                        message1=message1.replaceAll("[@!]","");
                        imei=token[0].replaceAll("@","");
                        query="select * from tbl_train_data where deviceid='"+imei+"' and Start_time='"+token[1]+"'";
                        try{      // check overwrite
                           rs = st.executeQuery(query);
                           while(rs.next()){train_id=rs.getString(1);}  
                           if (train_id !=""){                             
                             print.print("ACK"+token[0]+"\r\n"); 
                             //System.out.println("ACK"+token[0]+"\r\n"); 
                           }else{                          
                            String query1="INSERT  tbl_train_data ("+G_625XT_train+") values ('"+message1+"')";                                                  
                            //System.out.println("train_id_insert:"+train_id+"query:"+query1); 
                            try {
                               st.executeUpdate(query1);   
                               query="select * from tbl_train_data where deviceid='"+imei+"' and Start_time='"+token[1]+"'";
                               try {
                               rs = st.executeQuery(query);
                               while(rs.next()){train_id=rs.getString(1);}                            
                               } catch (Exception e) {
                                 error_log(message,st,"檢查重複上傳時， 查詢 train_id  錯誤",query1);
                               }
                               print.print("ACK"+token[0]+"\r\n"); 
                               System.out.println("ACK"+token[0]+"\r\n");                                
                            } catch (Exception e) {                             
                               error_log(message,st,"train data 寫入錯誤",query);
                            }
                            }   
                         } catch (Exception e1) {
                            error_log(message,st,"檢查重複上傳時，train 查詢錯誤 ",query);
                         }
                         train_id_temp=train_id;
                    
                    break;
                    case '#':            // lap data
                        message1=message1.replaceAll("[#!]","");
                        query="select * from tbl_lap_data where deviceid='"+imei+"' and Start_time='"+token[1]+"' and lap_no='"+token[2]+"'";
                        try{   // check overwrite
                           rs = st.executeQuery(query);
                           while(rs.next()){lap_id=rs.getString(1);}  
                           if (lap_id ==""){                             
                             String query2="INSERT  tbl_lap_data ("+G_625XT_lap+") values ('"+train_id_temp+"','"+message1+"')";
                             try{
                             st.executeUpdate(query2);
                             } catch (Exception e) {
                               error_log(message,st,"lap data 寫入錯誤",query);
                             }
                           }
                        } catch (Exception e1) {                           
                           error_log(message,st,"檢查 lap data 是否重複時錯誤 ",query);
                        }
                     if (message.matches(".*!$")){ 
                        print.print("ACK"+token[0]+","+token[2]+"\r\n");  
                        System.out.println("ACK"+token[0]+","+token[2]+"\r\n");  
                     }                                                  
                    break;                                        
                    case '$':        // point data
                        message1=message1.replaceAll("[$!]","");                                             
                        message1=message1.replaceAll(imei+"',","");
                        String imei1=imei.replaceAll("-","_");                        
                        // 韌體錯誤，日期檢查，現在看到會錯誤的，日期都會錯誤。                      
                        String gps_date=token[1];
                        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
                        Date d1 = null;
                        try{
                           d1=formatter.parse(gps_date);
                        } catch (Exception e) {error_log(message,st,"韌體錯誤，出錯無法轉換的日期", gps_date);}                           
                           Date d2 = new Date();                          
                           long diff = d2.getTime() - d1.getTime()+86500000;         // 還有時區的問題！目前是條件設定鬆一點，   
                           //System.out.println("now:time:"+d2);  
                           //System.out.println("gps:time:"+d1);                           
                       if (diff >0){         // 只要是負的就應該跳離，不可能會有未來日期                                                                           
                        try{            // 經緯度格式轉換        
                          String latitude=token[3];
                          String longitude=token[4];
                          if ( !latitude.equals("0")  && !longitude.equals("0")){         // 碰到 0 就不轉換，應該一個是0 ，另一個就是0 了吧                
                            int head_latitude=Integer.parseInt(latitude)/100;
                            int head_longitude=Integer.parseInt(longitude)/100;                                   
                            Double min_latitude =Double.parseDouble(latitude)-head_latitude*100;                        
                            Double min_longitude =Double.parseDouble(longitude)-head_longitude*100;
                            Double new_latitude=(head_latitude+  min_latitude/60)/10000;
                            Double new_longitude=(head_longitude+  min_longitude/60)/10000;      
                            // 若是經緯度很奇怪，這邊可能會錯 。所以最好不要這樣弄，有風險                                                                
                            message1=message1.replaceAll(latitude,Double.toString(new_latitude)); 
                            message1=message1.replaceAll(longitude,Double.toString(new_longitude));
                          }
                        } catch (Exception e) {
                          String  error_lat=token[3]+"-"+token[4];
                          error_log(message,st,"經緯度格式轉換錯誤",error_lat);                                                           
                        }                                                                
                        query="select * from "+imei1+" where Start_time='"+token[1]+"' and no='"+token[2]+"'" ;                                    
                        try{     // check overwrite
                          rs = st.executeQuery(query);
                          while(rs.next()){point_id=rs.getString(1);}                             
                            if (point_id ==""){                             
                              String query3="INSERT "+imei1+" ("+G_625XT_point+") values ('"+train_id_temp+"',"+message1+"')";                          
                            try{
                              st.executeUpdate(query3);
                            } catch (Exception e) {
                               //System.out.println("point data write error:"+query3); 
                               error_log(message,st,"point data 寫入錯誤",query3  );                                                           
                            }
                           } 
                        }catch (Exception e1) {                                                    
                           error_log(message,st,"point data 檢查重複錯誤",query);
                        } 
                        }else {error_log(message,st,"兩點時間相差為負的","error");}
                         
                        if (message.matches(".*!$")){       // 傳輸完畢的結尾，回傳 
                          print.print("ACK"+token[0]+","+token[2]+"\r\n"); 
                          System.out.print("ACK"+token[0]+","+token[2]+"\r\n"); 
                        }
                 
 
                      break;
                      case 'S':                                 // 路徑規劃,要先送出有幾筆， 實際分辨是 SR 
                       String user_id=""; 
                       String SR_data="";
                       int a=0;    
                       System.out.println("SR_GET:"+message);                 
                       device=token[1].replaceAll("!","");   
                       query="select * from tbl_device where deviceid='"+device+"'";
                       try {
                         rs = st.executeQuery(query);
                         while(rs.next()){user_id=rs.getString(6);}                        //  先取得 user_id  
                         String query3="select * from tbl_planning where user_planning='"+user_id+"' and  save='1'" ;

                         try {
                          rs = st.executeQuery(query3);           // 取得訓練計劃
                          while(rs.next())
                          {   
                             // 0 和 4 都重組，都送過去
                               String id_combian= rs.getString(1)+"_"+rs.getString(4); 
                              // System.out.print ( id_combian);
                             SR_data=SR_data+rs.getString(6)+";"+rs.getString(7)+";"+id_combian+",";     //改成撈id ，經緯度直接存在另一個資料表  
                             a=a+1;      
                          }
                          } catch (Exception e) {
                             error_log(message,st,"上傳資料到 device 錯誤，無法查詢",query3);                
                          } 
                          // 現在有兩個資料表，都要撈，撈第二個資料表
                         String query4="select * from tbl_planning_private_create where user_planning='"+user_id+"' and  save='1'" ;
                         try {
                          rs = st.executeQuery(query4);           // 取得訓練計劃
                          while(rs.next())
                          {       
                              String id_combian= rs.getString(1)+"_"+rs.getString(4);                  
                             SR_data=SR_data+rs.getString(6)+";"+rs.getString(7)+";"+id_combian+",";     //改成撈id ，經緯度直接存在另一個資料表  
                             a=a+1;      
                          }   
                          SR_data="ACKSR,"+a+","+SR_data;
                          SR_data=SR_data.substring(0,SR_data.length()-1);
                          //System.out.println("SR_data:"+SR_data);    
                          //String Numberofroutes="1";          // 總筆數
                          //String ASCIIname="ggg";             // pctool 呈現，限ASCII字符,要能自訂 
                          //String Unicodename="測試";          // Routekey : 獨立無二能驗證是哪就筆就好
                          //String Routekey ="1224";            // 能識別即可
                          print.print(SR_data +"\r\n"); 
                          System.out.print(SR_data +"\r\n"); 
  
                         } catch (Exception e) {
                           error_log(message,st,"取得自己建立的訓練計畫錯誤",query4);                
                         }                             
                       }catch (Exception e1) {                                                    
                           error_log(message,st,"訓練計畫，取得user_id 時錯誤", query);
                       }                                                     
                      break;
                      case 'G':                                // 路徑規劃,實際分辨是 GR，開始傳每一筆路徑的座標
                          String  RouteKey=token[2];                 // 資料庫的 autokey  and train_id                  
                          RouteKey=RouteKey.replaceAll("[!]","");
                          //System.out.print (RouteKey);
                          String[]RouteKey_array=RouteKey.split("_");   // 現在是要求送第幾筆的資料,還要作一次 if 判斷
                           //System.out.print (RouteKey_array[0]);
                          String GR_data="";
                          int b=0;                                        
                          String if_temp="0";                                    
                          // 開始撈每一點的資料 , 但是因為有兩個資料表，所以還要多一個判斷 
                            
                          if (RouteKey_array[1].equals(if_temp))
                          { 
                              query="select * from "+"tbl_planning_private_create_detail"+" where for_planning_id='"+RouteKey_array[0]+"'";                            
                          }else{
                              query="select * from "+"tbl_planning_200_point"+" where 200_for_point_id='"+RouteKey_array[1]+"'";  
                          }   
                          try {                           
                            rs = st.executeQuery(query);           // 取得每一點的經緯度
                            while(rs.next())
                            {
                               GR_data=GR_data+rs.getString(3)+";"+rs.getString(4)+",";   
                               b=b+1;      
                            }
                            // 可能需要原來的度分秒的格式才對，不確定，先這樣。
                            GR_data="ACKGR,"+RouteKey+","+b+","+GR_data;
                            GR_data=GR_data.substring(0,GR_data.length()-1);
                            print.print(GR_data+"\r\n"); 
                            System.out.print(GR_data+"\r\n"); 
                          }catch (Exception e) {                                                    
                            error_log(message,st,"訓練計算，取得詳細座標時錯誤", query);
                          }   
                          //String TotalNumberOfPoints="1";      // 全部幾點                          
                          //String Latitude="24.988613";               // 緯度
                          //String Longitude="121.46475";             // 經度
                          //  這邊也要迴圈，每一點經緯度組合 , 每一點用 , 隔開
                          //print.print("ACKGR"+","+RouteKey+","+ TotalNumberOfPoints+","+Latitude+";"+Longitude +"\r\n"); 
                          //System.out.print("ACKGR"+","+RouteKey+","+ TotalNumberOfPoints+","+Latitude+","+Longitude +"\r\n");           
                      break; 
                                           
                    default:
                  } 
             System.out.flush();
          //end   
          
           }     
                
            } catch (IOException e) {  
            } finally {  
                try {  
                    if(!s.isClosed()){  
                        s.close();  
                    }  
                } catch (IOException e1) {  
                    e1.printStackTrace();  
                }  
            }  
        }  
    }  
