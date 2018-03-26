mysql -u root -pgsdodohow <<EOC
#SHOW DATABASES;
USE sport;
 CREATE TABLE \`$1\` (
  \`id\` bigint(20) NOT NULL AUTO_INCREMENT,
  \`train_data_key\` bigint(20) NOT NULL COMMENT '關連到 train_data',
  \`start_time\` datetime NOT NULL COMMENT '機器傳來的時間',
  \`no\` int(11) NOT NULL COMMENT '編號，開始從 0 開始?  會一直累加下去 ',
  \`latitude\` double NOT NULL COMMENT '經度',
  \`longitude\` double NOT NULL COMMENT '緯度',
  \`altitude\` float NOT NULL COMMENT '高度',
  \`speed\` float NOT NULL COMMENT '速率',
  \`heart_rate\` int(11) NOT NULL COMMENT '心跳速率',
  \`cadence\` int(11) NOT NULL COMMENT '踏頻',
  \`pwr_cadence\` int(11) NOT NULL COMMENT '功率踏頻',
  \`power\` int(11) NOT NULL COMMENT '功率',
  \`distance\` int(11) NOT NULL COMMENT '與上一點距離',
  PRIMARY KEY (\`id\`),
  INDEX (\`train_data_key\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE \`$1\`
ADD FOREIGN KEY(\`train_data_key\`)
REFERENCES \`tbl_train_data\`(\`id\`) ON DELETE CASCADE  ON UPDATE CASCADE 
EOC

#  INDEX (\`train_data_key\`),
#  FOREIGN KEY (\`train_data_key\') REFERENCES  \`tbl_train_data\`(id)  ON DELETE CASCADE
