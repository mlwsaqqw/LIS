/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4659090909090909, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://www.amry.ru/chemistry/avtohimiya/ochistiteli-dvigatelya-narujnie-hi-gear-hg5377.html"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.amry.ru/chemistry/antifrizi/"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.amry.ru/"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.amry.ru/stocks/"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.amry.ru/accessories/bagajniki/"], "isController": false}, {"data": [0.15, 500, 1500, "https://www.amry.ru/tools/instrument-dlya-avtoelektroprovodki/"], "isController": false}, {"data": [0.75, 500, 1500, "https://www.amry.ru/chemistry/"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.amry.ru/shop/make_order.html?func=upd-1"], "isController": false}, {"data": [0.85, 500, 1500, "https://www.amry.ru/shop/make_order.html?func=upd-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.amry.ru/to_suppliers/"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.amry.ru/lamps/scheme/"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.amry.ru/shop/basket.html"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.amry.ru/shop/make_order.html?func=upd"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.amry.ru/accum/akkumulyator-6st---132-apz-bars-silver.html"], "isController": false}, {"data": [0.35, 500, 1500, "https://www.amry.ru/accum/"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.5, 500, 1500, "https://www.amry.ru/accessories/"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.amry.ru/tools/"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amry.ru/about/company/"], "isController": false}, {"data": [0.4, 500, 1500, "https://www.amry.ru/chemistry/avtohimiya/"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 210, 0, 0.0, 1030.6761904761904, 334, 2366, 939.5, 1519.8, 1783.7999999999997, 2257.56, 1.600012190569071, 293.74034814074776, 0.9750818339568302], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.amry.ru/chemistry/avtohimiya/ochistiteli-dvigatelya-narujnie-hi-gear-hg5377.html", 10, 0, 0.0, 1141.1, 1000, 1369, 1128.5, 1353.6000000000001, 1369.0, 1369.0, 4.612546125461255, 707.5528641028598, 2.77023033902214], "isController": false}, {"data": ["https://www.amry.ru/chemistry/antifrizi/", 10, 0, 0.0, 1292.1, 1203, 1359, 1301.0, 1357.7, 1359.0, 1359.0, 3.5298270384751147, 956.3401071081892, 1.9407154518178609], "isController": false}, {"data": ["https://www.amry.ru/", 20, 0, 0.0, 894.0999999999999, 707, 1034, 900.5, 1024.5, 1033.65, 1034.0, 1.7879492222420883, 317.6237665944037, 1.0345311661898802], "isController": false}, {"data": ["https://www.amry.ru/stocks/", 10, 0, 0.0, 842.3000000000001, 748, 917, 847.5, 916.0, 917.0, 917.0, 7.82472613458529, 1199.0941962539123, 4.202733763693271], "isController": false}, {"data": ["https://www.amry.ru/accessories/bagajniki/", 10, 0, 0.0, 1235.8, 1141, 1311, 1247.0, 1309.7, 1311.0, 1311.0, 2.5614754098360653, 1109.6686691534323, 1.4133140689036885], "isController": false}, {"data": ["https://www.amry.ru/tools/instrument-dlya-avtoelektroprovodki/", 10, 0, 0.0, 1598.0, 1071, 1984, 1676.0, 1979.4, 1984.0, 1984.0, 2.8200789622109417, 532.8351928228991, 1.611080266497462], "isController": false}, {"data": ["https://www.amry.ru/chemistry/", 20, 0, 0.0, 674.2500000000001, 334, 1059, 654.5, 1053.4, 1058.8, 1059.0, 0.38708678485716497, 31.323221396705893, 0.2277536990980878], "isController": false}, {"data": ["https://www.amry.ru/shop/make_order.html?func=upd-1", 10, 0, 0.0, 701.4, 638, 798, 688.5, 793.0, 798.0, 798.0, 2.883506343713956, 285.2277744737601, 1.9373558246828144], "isController": false}, {"data": ["https://www.amry.ru/shop/make_order.html?func=upd-0", 10, 0, 0.0, 480.5, 370, 692, 413.0, 688.9, 692.0, 692.0, 2.9308323563892147, 1.0246464683470107, 2.1122600381008207], "isController": false}, {"data": ["https://www.amry.ru/to_suppliers/", 10, 0, 0.0, 893.7, 748, 1189, 835.5, 1181.8, 1189.0, 1189.0, 7.8125, 1090.6097412109375, 4.241943359375], "isController": false}, {"data": ["https://www.amry.ru/lamps/scheme/", 10, 0, 0.0, 691.9999999999999, 628, 738, 694.5, 737.7, 738.0, 738.0, 3.1595576619273302, 585.9035594391785, 1.7155410742496051], "isController": false}, {"data": ["https://www.amry.ru/shop/basket.html", 10, 0, 0.0, 926.4, 694, 1064, 966.5, 1063.1, 1064.0, 1064.0, 2.649708532061473, 399.57397655007946, 1.4464717474827768], "isController": false}, {"data": ["https://www.amry.ru/shop/make_order.html?func=upd", 10, 0, 0.0, 1182.5, 1032, 1427, 1101.5, 1425.3, 1427.0, 1427.0, 2.44081034903588, 242.29094840737122, 3.399019099340981], "isController": false}, {"data": ["https://www.amry.ru/accum/akkumulyator-6st---132-apz-bars-silver.html", 10, 0, 0.0, 817.5, 762, 841, 834.0, 840.9, 841.0, 841.0, 5.9171597633136095, 890.4094628328403, 3.4208579881656807], "isController": false}, {"data": ["https://www.amry.ru/accum/", 10, 0, 0.0, 1489.5, 1279, 1797, 1437.5, 1789.9, 1797.0, 1797.0, 4.547521600727603, 2825.222402228286, 2.4380755457025924], "isController": false}, {"data": ["Test", 10, 0, 0.0, 20462.3, 19019, 21679, 20683.5, 21651.8, 21679.0, 21679.0, 0.45664185579250194, 1715.1678586921776, 5.208125228320927], "isController": true}, {"data": ["https://www.amry.ru/accessories/", 10, 0, 0.0, 825.0, 737, 915, 835.5, 911.8, 915.0, 915.0, 2.916302128900554, 430.92351086322543, 1.5806129702537184], "isController": false}, {"data": ["https://www.amry.ru/tools/", 10, 0, 0.0, 1013.0, 879, 1135, 1032.0, 1133.2, 1135.0, 1135.0, 3.687315634218289, 697.1439147769173, 1.9768909015486724], "isController": false}, {"data": ["https://www.amry.ru/about/company/", 10, 0, 0.0, 1969.5, 1520, 2366, 1970.0, 2355.2, 2366.0, 2366.0, 4.182350480970306, 577.7614949289, 2.0625849539941448], "isController": false}, {"data": ["https://www.amry.ru/chemistry/avtohimiya/", 10, 0, 0.0, 1407.2, 1253, 1525, 1456.5, 1524.3, 1525.0, 1525.0, 4.288164665523157, 932.0782355542453, 2.3618406946826758], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 210, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
