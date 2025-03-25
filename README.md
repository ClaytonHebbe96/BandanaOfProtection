<a id="readme-top"></a>

<h1 style="font-size: 4em; text-align: center;">Bandana of Protection</h1>
<h3 style="font-size: 1.5em; text-align: center;"><strong>Original Author jbs4bmx: rebuilt for SPTarkov v3.11 by IdiotTurdle</strong></h3>
</br>

<!-- TABLE OF CONTENTS -->
<details style="font-size: 1.25em;">
    <summary>Table of Contents</summary>
    <ol>
        <li>
            <a href="#about-the-project">About the Project</a>
            <ul>
                <li><a href="#built-with">Built With</a></li>
            </ul>
        </li>
        <li>
            <a href="#getting-started">Getting Started</a>
            <ul>
                <li><a href="#prerequisites">Prerequisites</a></li>
                <li><a href="#installation">Installation</a></li>
            </ul>
        </li>
        <li>
            <a href="#configuration">Configuration</a>
            <ul>
                <li><a href="#mod-faq">Mod FAQ</a></li>
            </ul>
        </li>
        <li><a href="#roadmap">Roadmap</a></li>
        <li><a href="#contributing">Contributing</a></li>
        <li><a href="#license">License</a></li>
        <li><a href="#acknowledgments">Acknowledgments</a></li>
    </ol>
</details>

<!-- ABOUT THE PROJECT -->
<h2 style="font-size: 2em;">About the Project</h2>

Type: server mod</br>
Disclaimer: **This mod is provided _as-is_ with _no guarantee_ of support.**

This mod adds a new version of the face cover of your choosing and adds armor protection for body parts based on how the configuration file is modified.

<ul style="list-style: none; text-align: center; display: block; margin-left: auto; margin-right: auto; width: 70%; padding-left: 0;">
    <li>Values of <b>armorCollider</b> array assigned by Armor mod options.</li>
    </br>

| Mod Option | Configurable Value | Assigned Value |
| :-----: | :-----: | :-----: |
| Head | true/false | ParietalHead, BackHead, HeadCommon |
| Neck | true/false | NeckFront, NeckBack |
| Eyes| true/false | Eyes |
| Ears | true/false | Ears |
| Jaw | true/false | Jaw |
| Back | true/false | SpineTop, SpineDown |
| Arms | true/false | LeftUpperArm, LeftForearm, RightUpperArm, RightForearm |
| Sides | true/false | RightSideChestUp, RightSideChestDown, LeftSideChestUp, LeftSideChestDown|
| Front | true/false | RibcageUp, RibcageLow |
| Pelvis | true/false | Pelvis |
| Buttocks | true/false | PelvisBack |
| Legs | true/false | RightThigh, RightCalf, LeftThigh, LeftCalf |
</ul>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<ul style="list-style: none; text-align: center; display: block; margin-left: auto; margin-right: auto; width: 50%; padding-left: 0;">
<li><h3>Built With</h3></li>

| Platform Type | Icon | Name | Link |
| :------------:| :---:| :--: | :--: |
| **Frameworks/Libraries:** | <img src="./images/icons/TypeScript.svg" width="48"> | `TypeScript` | [TypeScript Website][TypeScript-url] |
| **IDEs:** | <img src="./images/icons/vscode.svg" width="48"> | `VSCode` | [VSCode Website][VSCode-url] |
</ul>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
<h2>Getting Started</h2>
This section will explain how to install and use this mod.

<section style="margin-left: 3em;">
    <h3>Prerequisites:</h3>
    <p style="padding-left: 3em;">EFT and SPT are required to use this mod.</p>
</section>

<section style="margin-left: 3em;">
    <h3>Installation:</h3>
    <p style="padding-left: 3em;">
        <i>For the purpose of these directions, "[SPT]" represents your SPT folder path.</i>
        </br></br>
        Start by downloading the mod from the <a href="https://github.com/ClaytonHebbe96/BandanaOfProtection/releases/tag/311.0.0">Releases</a> page.
        </br></br>
        Follow these steps to install and configure the mod:
        <ol style="margin-left: 3em;">
            <li>Extract the contents of the zip file into the root of your [SPT] folder.</li>
            <ul>
                <li>That's the same location as <i>"SPT.Server.exe"</i> and <i>"SPT.Launcher.exe"</i></li>
            </ul>
            <li>Edit the config to adjust the values to your liking.</li>
            <li>Start <i>"SPT.Server.exe"</i> and wait until it shows <b>Server is running</b>.</li>
            <li>Start <i>"SPT.Launcer.exe"</i>.</li>
            <li>Now find the item in Ragman's stock and get to Escaping Tarkov.</li>
        </ol>
    </p>
</section>
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONFIGURATION -->
<h2>Configuration</h2>
Edit <code>'./config.jsonc'</code> file as desired. Specify which areas to protect, the ammount of protection, and which item you want BoP to look like. You can even customize trader pricing and loyalty level requirements to make it easier or harder on yourself to acquire this item.
</br></br>

**Important:** When changing the PreFab you must clear your SPT temp files before starting the game up again otherwise the prefab will not properly load and may cause issues.
</br></br>

```jsonc
{
    "ArmorCoverage": {
        // Customize BoP armor protection areas.
        // this value must be true or false.
        "Head": true,
        "Neck": true,
        "Eyes": true,
        "Ears": true,
        "Jaw": true,
        "Arms": false,
        "Front": false,
        "Back": false,
        "Sides": false,
        "Pelvis": false,
        "Buttocks": false,
        "Legs": false
    },
    "ArmorAmmount": {
        // Customize Bop armor durability level.
        // This must be a whole number ranging froom 1-9999999.
        "Durability": 1000
    },
    "Resources": {
        // Customize BoP item properties.
        "ArmorClass": "10",
        "ArmorMaterial": "Ceramic",
        "ArmorType": "Heavy",
        "ItemWeight": 0.1,

        // This is the ammount of protection from bright lights.
        // This must be any number value between 0 and 1 (e.g., 0, 0.25, 0.5, 0.8, 1)
        "BlindnessProtection": 0,

        // I recommend keeping this at or below 100
        // This must be a whole number ranging from 1-2000
        "RepairCost": 100,

        // Customize trader (Ragman) properties
        "traderPrice": 10000,
        "traderLoyaltyLevel": 1
    },
    "PreFab": {
        // Customize BoP look (Default: HalfMask)
        // If more than one or none are set to 'true', this will revert to the default.
        "HalfMask": true,
        "Balaclava": false,
        "BallisticMask": false,
        "BigPipe": false,
        "ColdFearBalaclava": false,
        "DeadlySkull": false,
        "DeathKnighMast": false,
        "DevBalaclava": false,
        "FacelessMask": false,
        "GhostBalaclava": false,
        "GhoulMask": false,
        "GloriousEMask": false,
        "GP5GasMask": false,
        "GP7GasMask": false,
        "GreenShemagh": false,
        "HalloweenSkullMask": false,
        "HockeyPlayerBrawler": false,
        "HockeyPlayerCaptain": false,
        "HockeyPlayerQuiet": false,
        "JasonMask": false,
        "MichaelMask": false,
        "MomexBalaclava": false,
        "NeopreneMask": false,
        "OpsCoreGasMaks": false,
        "PestilyMask": false,
        "RedBeard": false,
        "Respirator": false,
        "Rivals2021Balaclava": false,
        "RoninBallistic": false,
        "RoninRespirator": false,
        "ShatteredMask": false,
        "ShroudMask": false,
        "SkullHalfMask": false,
        "SlenderMask": false,
        "SmokeBalaclava": false,
        "StrikeBallMask": false,
        "TagillaGorilla": false,
        "TagillaUBEY": false,
        "TanShemagh": false,
        "TwitchRivals2020HalfMask": false,
        "TwitchRivals2020Mask": false,
        "WhiteBeard": false,
        "ZryachiyBalaclavaClosed": false,
        "ZryachiyHalloween": false
    },
    "GodMode": {
        // Disable damnage delt by blunt force trauma.
        "BluntForce": false
    },
    "Blacklist": {
        // Set to 'true' to disable item spawning on PMC bots, or to remove from global loot pools.
        "pmc": false,
        "globalLoot": false
    }
}
```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
<h2>Roadmap</h2>

- [x] Get BoP working on SPT v3.11
- [ ] Fix bugs found/reported in SPT v3.11

View/Report issues [here](https://github.com/ClaytonHebbe96/BandanaOfProtection/issues)

<!-- CONTRIBUTING -->
<h2>Contributing</h2>
If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
</br></br>

1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m "Add some amazing feature"`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

<!-- LICENSE -->
<h2>License</h2>

Distributed under the MIT License. See `License.txt` for more information.

<!-- ACKNOWLEDGMENTS -->
<h2>Acknowledgments</h2>

Additional Contributors:
1. [jbs4bmx](https://hub.sp-tarkov.com/user/3298-jbs4bmx/) - **Original Author**
    - Created this great mod for the community and has gratiously allowed me to take it over for future SPT versions.
2. [sugonyak](https://hub.sp-tarkov.com/user/24725-sugonyak)
    - Testing/bug fixes
3. [ShadowXtrex](https://hub.sp-tarkov.com/user/16610-shadowxtrex)
    - Testing/bug fixes
    - Code optimization


<!-- Repository Metrics -->

<!-- Mod Environment URLs -->
[TypeScript-url]: https://www.typescriptlang.org/
[VSCode-url]: https://code.visualstudio.com/