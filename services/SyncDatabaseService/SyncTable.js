import { getApiRequest } from "../../actions/api.action"
import { Strings } from "../../constants";
import { getLocalData } from "../../constants/Storage";
import { getBaskets } from "../../screens/GeoRep/Home/partial/containers/helper";
import { createTable, getDBConnection, handleRecords } from "../../sqlite/DBHelper";
import * as RNLocalize from 'react-native-localize';
import { getBasketDateTime } from "../../helpers/formatHelpers";
import { getBascketLastSyncTableData, insertBascketLastSync } from "../../sqlite/BascketLastSyncsHelper";

export const initializeDB = async() => {
    
    var res = await getApiRequest("database/offline_database_structure", {offline_db_version: '1.1'});
    if(res.status === Strings.Success){
        var offline_db_version = await getLocalData("@offline_db_version");
        if(offline_db_version != res.offline_db_version){                               
            var tables = res.tables;   
            console.log("offlien db structure", tables)         
            const db = await getDBConnection();
            if(db != null){                    
                await createTable(db ,tables);                                  
                var check = await getBascketLastSyncTableData("sync_all");                
                if(check.length == 0){
                    await syncTable(0);
                }                
                return "end";
            }                                            
        }else{
            console.log("offline version was not updated");
        }  
    }    
}


const syncTable = async(basketId) => {        
    
    var lists = getBaskets();
    var basket = lists[basketId].slug;
    var res = await getApiRequest("database/sync-tables?offline_db_version=1.1&sync_basket=" + basket, {});    
    if(res.status === Strings.Success){        
        var tables = res.tables;        
        console.log("all tables", tables);
        if( tables != null && tables.length > 0){
            await syncTableData(tables, 0 , 0, basket);
        }else{
            await saveSyncedStatusTable(basket);
        }
        if(basketId + 1 < lists.length){                      
            return await syncTable(basketId + 1);
        }else{                                                     
            await saveSyncedStatusTable("sync_all");
            return "ok";                                               
        }        
    }
}


const syncTableData = async (tables , key , pageNumber, basket) => {    
    var tableName = tables[key];      
    if(tableName != undefined){
        await getApiRequest(`database/sync-table-data?table=${tableName}&page=${pageNumber}` , {}).then( async(res) => {      
            await handleRecords(tableName, res.records);        
            if(pageNumber + 1 < res.total_pages){
                await syncTableData(tables , key, pageNumber + 1, basket);
            }else{
                if(key + 1 < tables.length){                      
                    await syncTableData(tables , key + 1 , 0 , basket );
                }else{   
                    await saveSyncedStatusTable(basket);                    
                }
            }
        }).catch((e) => {
    
        });    
    }
    
}


const saveSyncedStatusTable = async(basket) => {
    var time_zone = RNLocalize.getTimeZone();
    var currentTime = getBasketDateTime();
    await insertBascketLastSync(basket, currentTime, time_zone );
}

