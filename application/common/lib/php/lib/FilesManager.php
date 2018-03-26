<?php 
class FilesManager { 
	
	public function CalcDirectorySize($DirectoryPath) {
		$Size = 0;
		if($this->checkDirExist($DirectoryPath)){
			$Dir = opendir($DirectoryPath);
			if (!$Dir) return -1;
		  
			while (($File = readdir($Dir)) !== false) {
				if ($File[0] == '.') continue;
				if (is_dir($DirectoryPath.$File)){          
					$Size += $this->CalcDirectorySize($DirectoryPath.$File.DIRECTORY_SEPARATOR);
				}else{
					if(strpos($DirectoryPath,'thumbnail')!==false) {
						$Size += filesize($DirectoryPath.$File);
					}
				}
			}
			closedir($Dir);
			return $Size;
		}else{
			return 0;
		}
	}
	
	public function checkDirExist($DirectoryPath) {
		return is_dir($DirectoryPath);
	}
} 
?>