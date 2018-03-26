import java.net.*;
import java.io.*;  
import java.sql.*;
    public class ServerMain {  
        public ServerMain() {  
              ServerSocket ss = null;
            try {  
                ss = new ServerSocket(54321);              
                System.out.println("connect ok"   );                 
                while(true){  
                    Socket s = ss.accept();  
                     Thread thread=new ServerThread(s);
                     thread.start();
                }  
            } catch (IOException e) {  
                System.err.println("socket errot");
                e.printStackTrace();  
            }  
        }          
        public static void main(String[] args) {  
            new ServerMain();  
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
               


        public void run() {    
            try {  
                String message ="";
                String message1 ="";
                Statement st = null;
                ResultSet rs = null; 
                String need_id="";
                String imei="";
                String query="";
                String train_id_temp="";
                // 625XT, GB-580 , GB-1000
                String G_625XT_train="deviceid,Start_time,wTotalPoint,lTotalTime,lTotalDistance,wLapCnts,bMultiSport,wCalory,lMaxSpeed,cMaxHeart,cAvgHeart,wAscent,wDescent,sMinAlti,sMaxAlti,wAvgCadns,wBestCadns,wAvgPower,wMaxPower,cSport1,cSport2,cSport3,cSport4,cSport5";              
                String G_625XT_lap="train_data_key,deviceid,start_time,lap_no,total_time,total_distance,calory,maxspeed,max_heart,avg_heart,min_alt,max_alt,avg_cadns,best_cadns,avg_power,max_power,Multi_Sport_Index,start_pt,end_pt";
                String G_625XT_point="train_data_key,start_time,no,latitude,longitude,altitude,speed,heart_rate,cadence,pwr_cadence,power,distance"; 

while (!(message = read.readLine()).equals("")){
               String train_id="";
               String lap_id="";
               String point_id="";
               int error_input=0;
               String web="192.168.1.191";        
               try {
               Class.forName("com.mysql.jdbc.Driver");
                Connection ct = DriverManager.getConnection(
                    "jdbc:mysql://"+web+":3306/sport", "jdbc", "globajdbc1");
                st = ct.createStatement();
               } catch (Exception e) {
                 System.out.println("database connect error");  
               }                             
                 System.out.println("get:"+message); 
               // 大約判斷有沒有明顯錯誤，一開始有錯，就全部跳掉吧
                  if (message.contains(",-1,"))
                  {  error_input=1; } 

                // 還有一個功能還沒寫，自動創資料庫 ，還有註冊檢查
               // 目前只有環天的機器，整個架構都是以目前環天可用的作法判斷而已
               // 數據錯誤，跳過的功能未寫？
                    String[]token=message.split(",");      //原始數據的主分割
                    char  globalsat=token[0].charAt(0);    
                    message1=message.replaceAll(",","','");
                                  
                           
            if (error_input==0){  
                 switch(globalsat)
                 {
                    case 'C':
                     if (message.matches(".*!$")){
                       String  device=token[1].replaceAll("!","");   
                       query="select * from tbl_device where deviceid='"+device+"'";
                       try {
                        rs = st.executeQuery(query);
                        while(rs.next()){need_id=rs.getString(1);}
                        if (need_id !=""){
                          print.print("ACKCR,0,http://"+web+"\r\n");  
                          //System.out.print("ACKCR,0,http://"+web+"\r\n");    //標準輸出                    
                        } else{
                          print.print("ACKCR,1,http://"+web+"?access="+device+"\r\n");  
                         // System.out.print("ACKCR,1,http://"+web+"?access="+device+"\r\n");  
                         }  
                       } catch (Exception e) {                      
                          System.out.print("imei search error \r\n");
                       }
                     }                       
                    break; 
                    case '@':            // train data                                     
                        message1=message1.replaceAll("[@!]","");
                        imei=token[0].replaceAll("@","");
                        query="select * from tbl_train_data where deviceid='"+imei+"' and Start_time='"+token[1]+"'";
                        try{  // check overwrite
                           rs = st.executeQuery(query);
                           while(rs.next()){train_id=rs.getString(1);}  
                            System.out.println("train_id:"+train_id+"query:"+query); 
                           if (train_id !=""){                             
                             print.print("ACK"+token[0]+"\r\n");
                             //System.out.print("ACK"+token[0]+"\r\n");  
                           }else{                          
                            String query1="INSERT  tbl_train_data ("+G_625XT_train+") values ('"+message1+"')";                          
                           // System.out.println("query1:"+query1); 
                            try {
                             st.executeUpdate(query1);   
                             query="select * from tbl_train_data where deviceid='"+imei+"' and Start_time='"+token[1]+"'";
                             rs = st.executeQuery(query);
                             while(rs.next()){train_id=rs.getString(1);}                            
                             //System.out.print("ACK"+token[0]+"\r\n");  
                             print.print("ACK"+token[0]+"\r\n"); 
                             } catch (Exception e) {
                               System.out.print("train data save error \r\n");
                             }
                            }   
                         } catch (Exception e1) {
                            //System.out.println("get:"+message); 
                            System.out.print("train_id search error \r\n");
                         }
                         train_id_temp=train_id;
                    
                    break;
                    case '#':         // lap data
                        message1=message1.replaceAll("[#!]","");
                        query="select * from tbl_lap_data where deviceid='"+imei+"' and Start_time='"+token[1]+"' and lap_no='"+token[2]+"'";
                        try{   // check overwrite
                           rs = st.executeQuery(query);
                           while(rs.next()){lap_id=rs.getString(1);}  
                           if (lap_id ==""){                             
                             String query2="INSERT  tbl_lap_data ("+G_625XT_lap+") values ('" ;
                             query2+=train_id_temp+"','"+message1+"')";
                             try{
                             st.executeUpdate(query2);
                             } catch (Exception e) {
                             System.out.print("lap data save error \r\n");
                             }
                           }
                        } catch (Exception e1) {                           
                          System.out.println("get:"+message); 
                          System.out.print("lap id search error \r\n"); 
                       }
                     if (message.matches(".*!$")){ 
                        System.out.print("ACK"+token[0]+","+token[2]+"\r\n");  
                        print.print("ACK"+token[0]+","+token[2]+"\r\n");  
                     }                                                  
                    break;                                        
                    case '$':        // point data
                        message1=message1.replaceAll("[$!]","");                                             
                        message1=message1.replaceAll(imei+"',","");
                        System.out.print("message1"+message1+ "\r\n"); 
                        String imei1=imei.replaceAll("-","_");
                        // 特定欄位資料資料格式轉換
                        String latitude=token[3];
                        String longitude=token[4];
                        int latitude_total=latitude.length();                             
                        int longitude_total=longitude.length();                     
                        String new_latitude=latitude.substring(0,latitude_total-4)+Integer.parseInt(latitude.substring(latitude_total-4 ,latitude_total-2))/60+ Integer.parseInt(latitude.substring(latitude_total-2 ,latitude_total))/360000;
                        String new_longitude=longitude.substring(0,longitude_total-4)+Integer.parseInt(longitude.substring(longitude_total-4 ,longitude_total-2))/60+ Integer.parseInt(longitude.substring(longitude_total-2 ,longitude_total))/360000;
                        new_latitude= Float.toString(Float.parseFloat(new_latitude)/10000); 
                        new_longitude= Float.toString(Float.parseFloat(new_longitude)/10000);
                        message1=message1.replaceAll(latitude,new_latitude); 
                        message1=message1.replaceAll(longitude,new_longitude); 
                        query="select * from "+imei1+" where Start_time='"+token[1]+"' and no='"+token[2]+"'" ;                                    
                        try{     // check overwrite
                          rs = st.executeQuery(query);
                          while(rs.next()){point_id=rs.getString(1);}                             
                            if (point_id ==""){                             
                              String query3="INSERT "+imei1+" ("+G_625XT_point+") values ('+train_id_temp+"',"+message1+"')" ;                          
                            try{
                              st.executeUpdate(query3);
                            } catch (Exception e) {
                              System.out.print("point data insert error:"+query3+"\r\n");                                                             
                            }
                          } 
                        } catch (Exception e1) {                                                    
                             System.out.println("point id search error:"+message); 
                        } 
                        if (message.matches(".*!$")){       // 傳輸完畢的結尾，回傳 
                          //System.out.print("ACK"+token[0]+","+token[2]+"\r\n");  
                          print.print("ACK"+token[0]+","+token[2]+"\r\n"); 
                        } 
                      break;                                        
                    default:
                  } 
                /*
                 }else {  
                   System.out.print("error_input:"+message+"\r\n"); 
                   String query_error="insert tbl_error_log (log) values("+message+")";
                   try{  
                     st.executeUpdate(query_error);
                   } catch (Exception e) {} 
            
                   if (message.matches(".*!$") || message.matches(".*!$") ){   
                      print.print("ACK"+token[0]+","+token[2]+"\r\n");  
                   }else {
                     print.print("ACK"+token[0]+"\r\n"); 
                   }
*/
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
