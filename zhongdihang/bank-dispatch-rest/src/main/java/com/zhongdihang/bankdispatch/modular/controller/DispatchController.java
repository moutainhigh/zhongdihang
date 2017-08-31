package com.zhongdihang.bankdispatch.modular.controller;

import com.zhongdihang.bankdispatch.common.constant.DictEnum;
import com.zhongdihang.bankdispatch.core.controoller.BaseController;
import com.zhongdihang.bankdispatch.core.page.PageFactory;
import com.zhongdihang.bankdispatch.modular.domain.*;
import com.zhongdihang.bankdispatch.modular.service.DispatchService;
import com.zhongdihang.bankdispatch.modular.service.DispatchTrackService;
import com.zhongdihang.bankdispatch.modular.service.dto.DispatchDto;
import com.zhongdihang.bankdispatch.modular.service.form.newGUarantyForm;
import com.zhongdihang.bankdispatch.rest.ResultModel;
import com.zhongdihang.bankdispatch.rest.ResultStatus;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


/**
 * Created by win10 on 2017/08/17.
 */
@RestController
@RequestMapping("/dispatch")
@Api(description = "派单控制器")
public class DispatchController extends BaseController
{
    @Autowired
    private DispatchService dispatchService;
    @Autowired
    private DispatchTrackService dispatchTrackService;

    private static org.apache.log4j.Logger logger = org.apache.log4j.Logger.getLogger(DispatchController.class);

    @ApiOperation("按权重派单")
    @RequestMapping(value = "/randomDispatch", method = RequestMethod.POST)
    public ResultModel randomDispatch(@RequestBody List<newGUarantyForm> gUarantyFormList)
    {
        Bank bank = getUser().getBank();
        Long bankId = 0L;
        if (bank!=null)
        {
            bankId = bank.getId();
        }
        else
        {
            //当前用户非银行用户
            return ResultModel.error(ResultStatus.FAILURE,"当前用户非银行用户");
        }
        return ResultModel.ok(dispatchService.randomDispatch(bankId,getUser(),gUarantyFormList));
    }


    @ApiOperation("完成单据")
    @RequestMapping(value = "/dispatchUpdate", method = RequestMethod.POST)
    public ResultModel dispatchUpdate(@RequestParam int Status,Long dispatchId,Long fileId)
    {
        Dispatch dispatch = dispatchTrackService.dispatchUpdate(Status,dispatchId,fileId);
        return  ResultModel.ok(dispatch);
    }

    @ApiOperation("查询当前机构订单")
    @ApiImplicitParams
            ({
                    @ApiImplicitParam(paramType = "query", dataType = "int", name = "status", value = "状态", required = false),
                    @ApiImplicitParam(paramType = "query", dataType = "String", name = "dispatchNo", value = "单据号", required = false),
                    @ApiImplicitParam(paramType = "query", dataType = "Integer", name = "pageIndex", value = "当前页", required = true),
                    @ApiImplicitParam(paramType = "query", dataType = "Integer", name = "pageSize", value = "每页数量", required = true)
            })
    @RequestMapping(value = "/finddispatch", method = RequestMethod.GET)
    public @ResponseBody ResultModel finddispatch(String status,String dispatchNo)
    {
        Bank bank = new Bank();
        Assess assess = new Assess();
        if (getUser().getBank()!=null)
        {
            bank  = getUser().getBank();
        }
        else if (getUser().getAssess()!=null)
        {
            assess= getUser().getAssess();
        }
        else
        {
            return ResultModel.error(ResultStatus.FAILURE,"未找到账户信息");
        }

        PageRequest pageRequest = new PageFactory().defaultPage();
        Page<Dispatch> dispatches = dispatchService.findDispatch(status,bank,assess,dispatchNo,pageRequest);
        Page<DispatchDto> dispatchDtos = dispatches.map(new DispatchDto());
        dispatchDtos.forEach(t->t.setStatus(getDictDataName(DictEnum.单据状态,t.getStatus())));
        return  ResultModel.ok(dispatchDtos);
    }

    @ApiOperation("转正式评估")
    @RequestMapping(value = "/dispatchFormal", method = RequestMethod.GET)
    public ResultModel dispatchByFormal(@RequestParam Long dispatchId)
    {
        try
        {
            dispatchService.dispatchByFormal(dispatchId);
            return  ResultModel.ok();
        }
        catch (Exception e)
        {
            return ResultModel.error(ResultStatus.FAILURE,e);
        }
    }

}