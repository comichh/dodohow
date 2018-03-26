import java.net.*;
import java.io.*;  
import java.sql.*;
    public class ServerMain {  
        public ServerMain() {  
              ServerSocket ss = null;
            try {  
                ss = new ServerSocket(22222);              
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
                String message =null ;
                Statement st = null;
                ResultSet rs = null; 
                String need_id= null;
                String temp=null;
                String query =null ;
        
              String G_625XT_train="Start_time,wTotalPoint,lTotalTime,lTotalDistance,wLapCnts,bMultiSport,wCalory,lMaxSpeed,cMaxHeart,cAvgHeart,wAscent,sMinAlti,sMaxAlti,wAvgCadns,wMaxPower,cSport1,cSport2,cSport3,cSport4,cSport5,deviceid";
                String query1="INSERT  tbl_train_data ("+G_625XT_train+") values (" ;
              
while (!(message = read.readLine()).equals("")){
        
               try {
               Class.forName("com.mysql.jdbc.Driver");
                Connection ct = DriverManager.getConnection(
                    "jdbc:mysql://127.0.0.1:3306/log", "root", "12345678");
                st = ct.createStatement();
               } catch (Exception e) {
                  System.out.println("database connect error");  
               } 
                    System.out.println("get:"+message); 
                    String[]token=message.split(",");
                    char   test=token[0].charAt(0);                  
                 switch(test)
                  {
                    case 'C':
                     if (message.matches(".*!$")){ 
                       query="select * from tbl_device where deviceid='"+token[1]+"'";
                       try {
                        rs = st.executeQuery(query);
                        while(rs.next()){ need_id=rs.getString(1);}
                        print.print("ACKCR,0,http://192.168.1.195\r\n");  
                        System.out.print("ACKCR,0,http://192.168.1.195\r\n");  
                       } catch (Exception e) {                      
                        print.print("ACKCR,1,http://192.168.1.195?access="+token[1]+"\r\n");  
                        System.out.print("ACKCR,1,http://192.168.1.195?access="+token[1]+"\r\n");  
                       }
                     }                       
                    break; 
                    case '@':                      
                     if (message.matches(".*!$")){ 
                      token[token.length]+="','"+need_id;
                      for (int i=1 ; i<=token.length ; i++ ){     
                        token[i]=token[i].replaceAll(",","','");
                        temp+=token[i];
                      }
                        query1+=temp+")";
                        System.out.print("query_train::"+query1+"\r\n");
                      try {
                       st.executeUpdate(query1);   
                                       
                       System.out.print("ACK"+token[0]+"\r\n");  
                       print.print("ACK"+token[0]+"\r\n"); 
                      } catch (Exception e) {
                        System.out.print("train data save error \r\n");
                      }
                     }
                    break;
                    case '#':
                     if (message.matches(".*!$")){ 
                      System.out.print("ACK"+token[0]+","+token[2]+"\r\n");  
                      print.print("ACK"+token[0]+","+token[2]+"\r\n");  
                     }else {


                     }   
                    break;                                        
                    case '$':
                      System.out.print("ACK"+token[0]+","+token[2]+"\r\n");  
                      print.print("ACK"+token[0]+","+token[2]+"\r\n");  
                      break;                                        
                    default:
                     // System.out.print("other");
                     // print.print("ACKCR,0,http://192.168.1.195\r\n" );  
                  } 
                                 
                System.out.flush();
          //edn   
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
