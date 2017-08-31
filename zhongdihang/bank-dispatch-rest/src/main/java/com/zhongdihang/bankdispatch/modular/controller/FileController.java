package com.zhongdihang.bankdispatch.modular.controller;

import com.zhongdihang.bankdispatch.modular.service.FileService;
import com.zhongdihang.bankdispatch.rest.ResultModel;
import com.zhongdihang.bankdispatch.rest.ResultStatus;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.List;

@RestController
@RequestMapping("/file")
@Api(description = "文件控制器")
public class FileController {
    @Value("${upLoda.FilePath}")
    private String filePath;
    @Value("${upLoda.FileFormat}")
    private String fileFormat;
    @Value("${upLoda.FileSize}")
    private Long fileSize;
    @Autowired
    private FileService fileService;

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);
    //=======================================================
    //文件上传
    //======================================================
    @ApiOperation("单文件上传")
    @RequestMapping(value = "upload",method = RequestMethod.POST)
    @ResponseBody
    public ResultModel upload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResultModel.error(ResultStatus.FAILURE,"没有找到文件");
        }
        //  for (MultipartFile file:fileList) {
        com.zhongdihang.bankdispatch.modular.domain.File file1 = new com.zhongdihang.bankdispatch.modular.domain.File();
        //=======================================================
        // 获取文件名
        //=======================================================
        String fileName = file.getOriginalFilename();
        file1.setName(fileName);
        //=======================================================
        // logger.info("上传的文件名为：" + fileName);
        // 获取文件的后缀名
        //=======================================================
        String suffixName = fileName.substring(fileName.lastIndexOf("."));
        if (!suffixName.equals(fileFormat)) {
            return ResultModel.error(ResultStatus.FAILURE, "目前只接受"+fileFormat+"格式的文件");
        }
        //======================================================
        //MB换算为B
        //======================================================
        if (file.getSize()>fileSize*1024*1024){
            return ResultModel.error(ResultStatus.FAILURE, "目标文件大于"+fileSize+"MB");
        }

        file1.setSuffixName(suffixName);
        //=======================================================
        // logger.info("上传的后缀名为：" + suffixName);
        // 解决中文问题，liunx下中文路径，图片显示问题
        //fileName = UUID.randomUUID() + suffixName;
        //=======================================================
        File dest = new File(filePath + fileName);
        file1.setPath(filePath+fileName);
        fileService.saveFiel(file1);
        //====================================
        // 检测是否存在目录
        //====================================
        if (!dest.getParentFile().exists()) {
            dest.getParentFile().mkdirs();
        }
        try {
            file.transferTo(dest);
            return ResultModel.ok(file1);
        } catch (IllegalStateException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        //  }
        return ResultModel.error(ResultStatus.FAILURE, "上传失败");
    }

    @ApiOperation("文件下载")
    //=======================================
    //文件下载相关代码
    //=======================================
    @RequestMapping(value = "/download",method = RequestMethod.GET)
    public String downloadFile(HttpServletRequest request, HttpServletResponse response,@RequestParam Long fileId){
        com.zhongdihang.bankdispatch.modular.domain.File fileM = fileService.findFile(fileId);
        String fileName =fileM.getName();
        if (fileName != null) {
            //===================================================================
            // 当前是从该工程的WEB-INF//File//下获取文件(该目录可以在下面一行代码配置)
            // 然后下载到C:\\users\\downloads即本机的默认下载的目录
            //===================================================================
           /* String realPath = request.getServletContext().getRealPath(
                    "//WEB-INF//");*/
            File file = new File(fileM.getPath(), fileName);
            if (file.exists()) {
                response.setContentType("application/force-download");// 设置强制下载不打开
                response.addHeader("Content-Disposition",
                        "attachment;fileName=" + fileName);// 设置文件名
                byte[] buffer = new byte[1024];
                FileInputStream fis = null;
                BufferedInputStream bis = null;
                try {
                    fis = new FileInputStream(file);
                    bis = new BufferedInputStream(fis);
                    OutputStream os = response.getOutputStream();
                    int i = bis.read(buffer);
                    while (i != -1) {
                        os.write(buffer, 0, i);
                        i = bis.read(buffer);
                    }
                    logger.info("success");
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    if (bis != null) {
                        try {
                            bis.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                    if (fis != null) {
                        try {
                            fis.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }
        return fileName;
    }

    @ApiOperation("多文件上传")
    //==========================================
    //多文件上传
    //=========================================
    @RequestMapping(value = "/batch/upload", method = RequestMethod.POST)
    @ResponseBody
    public String handleFileUpload(HttpServletRequest request) {
        List<MultipartFile> files = ((MultipartHttpServletRequest) request)
                .getFiles("file");
        MultipartFile file = null;
        BufferedOutputStream stream = null;
        for (int i = 0; i < files.size(); ++i) {
            file = files.get(i);
            if (!file.isEmpty()) {
                try {
                    byte[] bytes = file.getBytes();
                    stream = new BufferedOutputStream(new FileOutputStream(
                            new File(file.getOriginalFilename())));
                    stream.write(bytes);
                    stream.close();

                } catch (Exception e) {
                    stream = null;
                    return "You failed to upload " + i + " => "
                            + e.getMessage();
                }
            } else {
                return "You failed to upload " + i
                        + " because the file was empty.";
            }
        }
        return "upload successful";
    }
}