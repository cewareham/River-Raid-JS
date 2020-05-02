"use strict";

/*
Portuguese:
0-null, 1-avião, 2-fundo, 3-agua, (4-helice, 5-corpo, 6-meio), (7-cabine, 8-convéz, 9-casco),
(10-base, 11-asfalto, (1-faixa), (12-fuel, 13-branco), 14-painel, (1)-letras, ((13-Parede),
 15-arvore, 16-tronco), (17-suporte, 18-tabua1- 19-tabua2, (1-faixa),(13-shot))

 English:
 0-null, 1-airplane, 2-bottom, 3-water, (4-propeller, 5-body, 6-middle), (7-cabin, 8-deck, 9-hull),
(10-base, 11-asphalt, (1-banner), (12-fuel, 13-white), 14-panel, (1)-letters, ((13-Wall),
 15-tree, 16-trunk), (17-support, 18-board1- 19-board2, (1-banner),(13-shot))
*/
//             0         1       2-green terrain 3      4         5          6        7
//let clr = [0x000000, 0xE8E84A, 0x6E9C42, 0x2D32B8, 0xD2A44A, 0x004030, 0x000089, 0x000000,
//             8         9       10         11        12        13         14       15   
//           0xA33915, 0x54A0C5, 0x6F6F6F, 0xAAAAAA, 0xD65C5C, 0xD6D6D6, 0x8E8E8E, 0x9ED065,
//            16        17       18         19        20        21         22       23
//           0x474700, 0x7C2C00, 0x86861D, 0x69690F, 0xBBBB35, 0x75CCEB, 0x75B5EF, 0x355F18]

//             0          1         2           3          4          5          6         7
let clr = ['#000000', '#E8E84A', '#6E9C42', '#2D32B8', '#D2A44A', '#004030', '#000089', '#000000',
    //         8          9          10        11         12         13          14        15   
           '#A33915', '#54A0C5', '#6F6F6F', '#AAAAAA', '#D65C5C', '#D6D6D6', '#8E8E8E', '#9ED065',
    //         16        17         18         19         20         21         22        23
           '#474700', '#7C2C00', '#86861D', '#69690F', '#BBBB35', '#75CCEB', '#75B5EF', '#355F18']
    