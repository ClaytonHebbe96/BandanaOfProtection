import { DependencyContainer } from "tsyringe";

import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { IItemConfig } from "@spt/models/spt/config/IItemConfig";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { FileSystemSync } from "@spt/utils/FileSystemSync";
import { IPmcConfig } from "@spt/models/spt/config/IPmcConfig";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { jsonc } from "jsonc";
import path from "path";

class Bandana implements IPreSptLoadMod, IPostDBLoadMod
{
    private pkg;
    private bopDB = require("../database/dbItems.json");
    private bopTA = require("../database/ragmanAssort.json");

    public preSptLoad(container: DependencyContainer): void
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        logger.logWithColor("[ BoP ] Loading Bandana of Protection", LogTextColor.GREEN);
    }

    public postDBLoad(container: DependencyContainer): void
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const db = container.resolve<DatabaseServer>("DatabaseServer").getTables();
        const locales = db.locales.global;
        const handbook = db.templates.handbook.Items;
        this.pkg = require("../package.json");

        for (const iItem in this.bopDB.templates) 
        {
            db.templates.items[iItem] = this.bopDB.templates[iItem];
        }

        for (const hItem of this.bopDB.handbook.Items)                                                    
        {
            if (!handbook.find(i=>i.Id == hItem.Id))
            {
                handbook.push(hItem);
            }
        }

        for (const lItem in this.bopDB.locales.en)
        {
            locales.en[lItem] = this.bopDB.locales.en[lItem];
        }

        for (const pItem in this.bopDB.prices)
        {
            db.templates.prices[pItem] = this.bopDB.prices[pItem];
        }

        for (const tradeName in db.traders)
        {
            // Ragman
            if ( tradeName === "5ac3b934156ae10c4430e83c")
            {
                for (const riItem of this.bopTA.items)
                {
                    if (!db.traders[tradeName].assort.items.find(i=>i._id == riItem._id))
                    {
                        db.traders[tradeName].assort.items.push(riItem);
                    }
                }

                for (const rbItem in this.bopTA.barter_scheme)
                {
                    db.traders[tradeName].assort.barter_scheme[rbItem] = this.bopTA.barter_scheme[rbItem];
                }

                for (const rlItem in this.bopTA.loyal_level_items)
                {
                    db.traders[tradeName].assort.loyal_level_items[rlItem] = this.bopTA.loyal_level_items[rlItem];
                }
            }
        }

        this.setConfigOptions(container)

        logger.logWithColor("[ BoP ] Cached Successfully", LogTextColor.GREEN);
    }

    public setConfigOptions(container: DependencyContainer): void
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const db = container.resolve<DatabaseServer>("DatabaseServer").getTables();
        const handBook = db.templates.handbook.Items;
        const priceList = db.templates.prices;
        const barterScheme = db.traders["5ac3b934156ae10c4430e83c"].assort.barter_scheme;
        const loyaltyItems = db.traders["5ac3b934156ae10c4430e83c"].assort.loyal_level_items;
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const pmcConfig = configServer.getConfig<IPmcConfig>(ConfigTypes.PMC);
        const itemConfig = configServer.getConfig<IItemConfig>(ConfigTypes.ITEM);
        const fs = container.resolve<FileSystemSync>("FileSystemSync");
        const modConfig = jsonc.parse(fs.read(path.resolve(__dirname, "../config/config.jsonc")));
        const armorCoverage = modConfig.ArmorCoverage;
        const armorAmmount = modConfig.ArmorAmmount;
        const resources = modConfig.Resources;
        const preFab = modConfig.PreFab;
        const godMode = modConfig.GodMode;
        const blacklist = modConfig.Blacklist;

        // Add item to filter so it can be worn
        db.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[4]._props.filters[0].Filter.push("660877b848b061d3eca2579f");

        // Cost and Durability range verification
        if (typeof resources.RepairCost === "number")
        {
            if ((resources.RepairCost < 1) || (resources.Repaircost > 2000))
            {
                resources.RepairCost = 1000;
            }
        }

        if (typeof armorAmmount.Durability === "number")
        {
            if ((armorAmmount.Durability < 1) || (armorAmmount.Durability > 9999999))
            {
                armorAmmount.Durability = 1500;
            }
        }

        if (typeof resources.traderPrice === "number")
        {
            if ((resources.traderPrice < 1) || (resources.traderPrice > 9999999))
            {
                resources.traderPrice = 69420;
            }
        }

        // Armor Colliders Config
        const colliders: string[] = [];

        if (typeof armorCoverage.Head === "boolean")
        {
            if (armorCoverage.Head === true)
            {
                colliders.push("ParietalHead", "BackHead", "HeadCommon");
            }
        }

        if (typeof armorCoverage.Neck === "boolean")
        {
            if (armorCoverage.Neck === true)
            {
                colliders.push("NeckFront", "NeckBack");
            }
        }

        if (typeof armorCoverage.Eyes === "boolean")
        {
            if (armorCoverage.Eyes === true)
            {
                colliders.push("Eyes");
            }
        }

        if (typeof armorCoverage.Ears === "boolean")
        {
            if (armorCoverage.Ears === true)
            {
                colliders.push("Ears");
            }
        }

        if (typeof armorCoverage.Jaw === "boolean")
        {
            if (armorCoverage.Jaw === true)
            {
                colliders.push("Jaw");
            }
        }

        if (typeof armorCoverage.Arms === "boolean")
        {
            if (armorCoverage.Arms === true)
            {
                colliders.push("LeftUpperArm", "LeftForearm", "RightUpperArm", "RightForearm");
            }
        }

        if (typeof armorCoverage.Front === "boolean")
        {
            if (armorCoverage.Front === true)
            {
                colliders.push("RibcageUp", "RibcageLow");
            }
        }

        if (typeof armorCoverage.Back === "boolean")
        {
            if (armorCoverage.Back === true)
            {
                colliders.push("SpineTop", "SpineDown");
            }
        }

        if (typeof armorCoverage.Sides === "boolean")
        {
            if (armorCoverage.Sides === true)
            {
                colliders.push("RightSideChestUp", "RightSideChestDown", "LeftSideChestUp", "LeftSideChestDown");
            }
        }

        if (typeof armorCoverage.Pelvis === "boolean")
        {
            if (armorCoverage.Pelvis === true)
            {
                colliders.push("Pelvis");
            }
        }

        if (typeof armorCoverage.Buttocks === "boolean")
        {
            if (armorCoverage.Buttocks === true)
            {
                colliders.push("PelvisBack");
            }
        }

        if (typeof armorCoverage.Legs === "boolean")
        {
            if (armorCoverage.Legs === true)
            {
                colliders.push("LeftThigh", "LeftCalf", "RightThigh", "RightCalf");
            }
        }

        // Trader Settings (From resources)
        for ( let i=0; i<handBook.length; i++ )
        {
            if ( handBook[i].Id == "660877b848b061d3eca2579f")
            {
                handBook[i].Price = resources.traderPrice;
            }
        }

        for ( let i=0; i<priceList.length; i++ )
        {
            if ( priceList[i].toString() == "660877b848b061d3eca2579f" )
            {
                priceList[i] = resources.traderPrice;
            }
        }

        for (const barterItem in barterScheme)
        {
            if (barterItem == "660877b848b061d3eca2579f")
            {
                barterScheme[barterItem][0][0].count = resources.traderPrice;
            }
        }
        
        for (const loyalItem in loyaltyItems)
        {
            if (loyalItem == "660877b848b061d3eca2579f")
            {
                loyaltyItems[loyalItem] = resources.traderLoyaltyLevel;
            }
        }

        // PreFab
        let prefabCount = 0;
        let trueKey: string | null = null;

        for (const key in preFab)
        {
            if (preFab[key] === true)
            {
                prefabCount++;
                trueKey = key;
            }
        }

        if (prefabCount === 0)
        {
            logger.error("[ BoP ] No property for PreFab is set to 'true' in config.json. Defaulting to HalfMask");
            db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_buffalo/item_equipment_facecover_buffalo.bundle";
        }
        else if (prefabCount > 1)
        {
            logger.error("[ BoP ] More than one property value for PreFab is set to 'true' in config.json. Defaulting to HalfMask.");
            db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_buffalo/item_equipment_facecover_buffalo.bundle";
        }
        else
        {
            switch ( trueKey )
            {
                case "Balaclava": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_balaclava/item_equipment_facecover_balaclava.bundle";
                    break;
                }
                case "BallisticMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_ballistic_mask/item_equipment_facecover_ballistic_mask.bundle";
                    break;
                }
                case "BigPipe": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_pipe/item_equipment_facecover_pipe.bundle";
                    break;
                }
                case "ColdFearBalaclava": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_coldgear/item_equipment_facecover_coldgear.bundle";
                    break;
                }
                case "DeadlySkull": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_skullmask/item_equipment_facecover_skullmask.bundle";
                    break;
                }
                case "DeathKnightMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_boss_blackknight/item_equipment_facecover_boss_blackknight.bundle";
                    break;
                }
                case "DevBalaclava": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_balaclava/item_equipment_facecover_balaclava_development.bundle";
                    break;
                }
                case "FacelessMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_halloween_kaonasi/item_equipment_facecover_halloween_kaonasi.bundle";
                    break;
                }
                case "GhostBalaclava": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_balaclavaskull/item_equipment_facecover_balaclavaskull.bundle";
                    break;
                }
                case "GhoulMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_halloween_vampire/item_equipment_facecover_halloween_vampire.bundle";
                    break;
                }
                case "GloriousEMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_glorious/item_equipment_facecover_glorious.bundle";
                    break;
                }
                case "GP5GasMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_gasmask_gp5/item_equipment_facecover_gasmask_gp5.bundle";
                    break;
                }
                case "GP7GasMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_gasmask_gp7/item_equipment_facecover_gasmask_gp7.bundle";
                    break;
                }
                case "GreenShemagh": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_shemagh/item_equipment_facecover_shemagh.bundle";
                    break;
                }
                case "HalfMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_buffalo/item_equipment_facecover_buffalo.bundle"
                    break;
                }
                case "HalloweenSkullMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_halloween_skull/item_equipment_facecover_halloween_skull.bundle";
                    break;
                }
                case "HockeyPlayerBrawler": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_hockey/item_equipment_facecover_hockey_02.bundle";
                    break;
                }
                case "HockeyPlayerCaptain": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_hockey/item_equipment_facecover_hockey_01.bundle";
                    break;
                }
                case "HockeyPlayerQuiet": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_hockey/item_equipment_facecover_hockey_03.bundle";
                    break;
                }
                case "JasonMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_halloween_jason/item_equipment_facecover_halloween_jason.bundle";
                    break;
                }
                case "MichaelMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_halloween_michael/item_equipment_facecover_halloween_micheal.bundle";
                    break;
                }
                case "MomexBalaclava": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_nomexbalaclava/item_equipment_facecover_nomexbalaclava.bundle";
                    break;
                }
                case "NeopreneMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_redflame/item_equipment_facecover_redflame.bundle";
                    break;
                }
                case "OpsCoreGasMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_gasmask_opscore/item_equipment_facecover_gasmask_opscore.bundle";
                    break;
                }
                case "PestilyMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_pestily/item_equipment_facecover_pestily.bundle";
                    break;
                }
                case "RedBeard": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/item_beard/item_equipment_facecover_beard_red.bundle";
                    break;
                }
                case "Respirator": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_gasmask_3m/item_equipment_facecover_gasmask_3m.bundle";
                    break;
                }
                case "Rivals2021Balaclava": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_coldgear/item_equipment_facecover_coldgear_twitch.bundle";
                    break;
                }
                case "RoninBallistic": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_devtac/item_equipment_facecover_devtac.bundle";
                    break;
                }
                case "RoninRespirator": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_devtac/item_equipment_facecover_devtac_gen2.bundle";
                    break;
                }
                case "ShatteredMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_shatteredmask/item_equipment_facecover_shatteredmask.bundle";
                    break;
                }
                case "ShroudMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_shroud/item_equipment_facecover_shroud.bundle";
                    break;
                }
                case "SkullHalfMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_skull_half_mask/item_equipment_facecover_skull_half_mask.bundle";
                    break;
                }
                case "SlenderMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_halloween_slander/item_equipment_facecover_halloween_slander.bundle";
                    break;
                }
                case "SmokeBalaclava": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_smoke/item_equipment_head_smoke.bundle";
                    break;
                }
                case "StrikeBallMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_strikeball_mask/item_equipment_facecover_strikeball_mask.bundle";
                    break;
                }
                case "TagillaGorilla": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_welding/item_equipment_facecover_welding_gorilla.bundle";
                    break;
                }
                case "TagillaUBEY": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_welding/item_equipment_facecover_welding_kill.bundle";
                    break;
                }
                case "TanShemagh": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_shemagh_02/item_equipment_facecover_shemagh_02.bundle";
                    break;
                }
                case "TwithRivals2020HalfMask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_shroud/item_equipment_facecover_shroud_twitch.bundle";
                    break;
                }
                case "TwitchRivals2020Mask": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_redflame/item_equipment_facecover_redflame_twitch.bundle";
                    break;
                }
                case "WhiteBeard": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/item_beard/item_beard.bundle";
                    break;
                }
                case "ZryachiyBalaclavaClosed": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_boss_zryachi_closed/facecover_boss_zryachi_closed.bundle";
                    break;
                }
                case "ZryachiyHalloween": {
                    logger.info(`[ BoP ] Setting BoP PreFab to ${trueKey}`);
                    db.templates.items["660877b848b061d3eca2579f"]._props.Prefab.path = "assets/content/items/equipment/facecover_boss_zryachi_closed/facecover_boss_zryachi_closed_halloween.bundle";
                    break;
                }
            }
        }

        // resources
        db.templates.items["660877b848b061d3eca2579f"]._props.ArmorMaterial = resources.ArmorMaterial;
        db.templates.items["660877b848b061d3eca2579f"]._props.ArmorType = resources.ArmorType;
        db.templates.items["660877b848b061d3eca2579f"]._props.BlindnessProtection = resources.BlindnessProtection;
        db.templates.items["660877b848b061d3eca2579f"]._props.Durability = armorAmmount.Durability;
        db.templates.items["660877b848b061d3eca2579f"]._props.MaxDurability = armorAmmount.Durability;
        db.templates.items["660877b848b061d3eca2579f"]._props.armorClass = resources.ArmorClass;
        db.templates.items["660877b848b061d3eca2579f"]._props.Weight = resources.ItemWeight;
        db.templates.items["660877b848b061d3eca2579f"]._props.RepairCost = resources.RepairCost;
        db.templates.items["660877b848b061d3eca2579f"]._props.armorColliders = colliders;

        // godMode
        if (typeof godMode.BluntForce === "boolean")
        {
            if (blacklist.pmc === true)
            {
                pmcConfig.vestLoot.blacklist.push("660877b848b061d3eca2579f");
                pmcConfig.pocketLoot.blacklist.push("660877b848b061d3eca2579f");
                pmcConfig.backpackLoot.blacklist.push("660877b848b061d3eca2579f");
            }
        }

        if (typeof blacklist.globalLoot === "boolean")
        {
            if (blacklist.globalLoot === true)
            {
                itemConfig.blacklist.push("660877b848b061d3eca2579f");
            }
        }
    }
}

export const mod = new Bandana();
