export function checkNsInstance(ns, fnName = "this function") {
  if (!ns.print) throw new Error(`The first argument to ${fnName} should be a 'ns' instance.`);
  return ns;
}

export async function autoRetry(ns, fnFunctionThatMayFail, fnSuccessCondition, errorContext = "Success condition not met",
                                maxRetries = 5, initialRetryDelayMs = 50, backoffRate = 3, verbose = false, tprintFatalErrors = true) {
  checkNsInstance(ns, '"autoRetry"');
  let retryDelayMs = initialRetryDelayMs, attempts = 0;
  while (attempts++ <= maxRetries) {
    try {
      const result = await fnFunctionThatMayFail()
      const error = typeof errorContext === 'string' ? errorContext : errorContext();
      if (!fnSuccessCondition(result))
        throw (typeof error === 'string' ? new Error(error) : error);
      return result;
    }
    catch (error) {
      const fatal = attempts >= maxRetries;
      log(ns, `${fatal ? 'FAIL' : 'INFO'}: Attempt ${attempts} of ${maxRetries} failed` +
        (fatal ? `: ${String(error)}` : `. Trying again in ${retryDelayMs}ms...`),
        tprintFatalErrors && fatal, !verbose ? undefined : (fatal ? 'error' : 'info'))
      if (fatal) throw error;
      await ns.sleep(retryDelayMs);
      retryDelayMs *= backoffRate;
    }
  }
}

let wnd
let doc

const argsSchema = [
  ['loop', 99999], // Number of times to infiltrate
  ['quiet', false], // Passed through to infiltrate.js
  ['faction', 'BitBurners'], // Faction to buy rep for
  ['target', 'MegaCorp'], // Company to target
]

// TODO: All of this should be shared helper data.
//       (Or the game bug should be fixed...)
// TODO: Put infiltration data here, or somewhere, so
//       daemon/autopilot can pick an appropriate
//       target. (What is best? Need to measure
//       rep/sec averages, and it may change based
//       on your stats/augs? Or, if it doesn't matter,
//       just pick the shortest target in current city.)
// NOTE: Rewards seem to go up more than superlinear:
//       2.991k for 6 rounds at NetLink = 498.5/round
//         $2.552m
//       112.272k for 15 at Bachman = 7484.8/round
//         $1.722b
//       556.668k for 50 at NWO = 11133.36/round
//         $9.187b
//       Makes sense, since difficulty goes up.
const factions = [
  'Illuminati', 'Daedalus', 'The Covenant',
  'ECorp', 'MegaCorp', 'Bachman & Associates',
  'Blade Industries', 'NWO', 'Clarke Incorporated',
  'OmniTek Incorporated', 'Four Sigma', 'KuaiGong International',
  'Fulcrum Secret Technologies',
  'BitRunners', 'The Black Hand', 'NiteSec',
  'Aevum', 'Chongqing', 'Ishima', 'New Tokyo',
  'Sector-12', 'Volhaven',
  'Speakers for the Dead', 'The Dark Army', 'The Syndicate',
  'Silhouette', 'Tetrads', 'Slum Snakes', 'Netburners',
  'Tian Di Hui', 'CyberSec',
]

const companies = {
  'AeroCorp': 'Aevum',
  'Bachman & Associates': 'Aevum',
  'Clarke Incorporated': 'Aevum',
  'ECorp': 'Aevum',
  'Fulcum Technologies': 'Aevum',
  'Galactic Cybersystems': 'Aevum',
  'NetLink Technologies': 'Aevum',
  'Aevum Police Headquarter': 'Aevum',
  'Rho Construction': 'Aevum',
  'Watchdog Security': 'Aevum',
  'KuaiGong International': 'Chongqing',
  'Solaris Space Systems': 'Chongqing',
  'Nova Medical': 'Ishima',
  'Omega Software': 'Ishima',
  'Storm Technologies': 'Ishima',
  'DefComm': 'New Tokyo',
  'Global Pharmaceuticals': 'New Tokyo',
  'Noodle Bar': 'New Tokyo',
  'VitaLife': 'New Tokyo',
  'Alpha Enterprises': 'Sector-12',
  'Blade Industries': 'Sector-12',
  'Carmichael Security': 'Sector-12',
  'DeltaOne': 'Sector-12',
  'Four Sigma': 'Sector-12',
  'Icarus Microsystems': 'Sector-12',
  "Joe's Guns": 'Sector-12', // may not escape properly
  'MegaCorp': 'Sector-12',
  'Universal Energy': 'Sector-12', // quick target
  'CompuTek': 'Volhaven',
  'Helios Labs': 'Volhaven',
  'LexoCorp': 'Volhaven',
  'NWO': 'Volhaven', // largest target (level 50)
  'OmniTek Incorporation': 'Volhaven',
  'Omnia Cybersystems': 'Volhaven',
  'SysCore Securities': 'Volhaven',
}

export function autocomplete(data, args) {
  data.flags(argsSchema)
  const lastFlag = args.length > 1 ? args[args.length - 2] : null
  if (['--faction'].includes(lastFlag))
    return factions.map(f => f.replaceAll(' ', '_')).concat(['none'])
  if (['--target'].includes(lastFlag))
    return Object.keys(companies).map(c => c.replaceAll(' ', '_'))
  return []
}

/** @param {NS} ns **/
export async function main(ns) {
  // TODO: Make daemon launch this whenever we're not focused
  //       and idle? Or only under certain conditions? Just
  //       run once per daemon loop, or --loop Infinity until
  //       daemon kills us, or estimate time, or...?
  const args = ns.flags(argsSchema)
  const faction = args.faction.replaceAll('_', ' ')
  const target = args.target.replaceAll('_', ' ')
  const city = companies[target]

  // TODO: --status it, so if it was off we can re-disable
  //       when we're done?
  let iargs = ['--start']
  if (args.quiet) iargs.push('--quiet')
  const pid = ns.run('infiltrate.js', 1, ...iargs)
  while (ns.isRunning(pid)) {
    await ns.sleep(250)
  }

  wnd = eval('window')
  doc = wnd['document']

  for (let i = 0; i < args.loop; ++i) {
    await infiltrate(ns, city, target, faction)
  }
  notifyMe('Infiltration loop finished.')
}

async function infiltrate(ns, city, target, faction) {
  // if (city) {
  // // TODO: Use UI instead of singularity
  //     ns.singularity.travelToCity(city)
  // }
  try {
    await click(await findRetry(ns, "//div[(@role = 'button') and (contains(., 'City'))]"))
    // TODO: Does this work with Joe's Guns?
    await click(await findRetry(ns, `//span[@aria-label = '${target}']`))
    await click(await findRetry(ns, "//button[contains(text(), 'Infiltrate Company')]"))
  } catch (err) {
    ns.tprint(`Couldn't find ${city} / ${target}: ${err}`)
    return
  }
  while (true) {
    if (faction == 'none') {
      const btn = find("//button[contains(text(), 'Sell')]")
      if (btn) {
        await click(btn)
        ns.tprint(`${btn.innerText}`)
        break
      }
    } else {
      // TODO: Use findRetry?
      const option = find("//div[@aria-haspopup = 'listbox']")
      if (option) {
        await setText(option.nextSibling, faction)
        const btn = find("//button[contains(text(), 'Trade')]")
        if (btn) {
          await click(btn)
          // TODO: Log somewhere better? Toast?
          ns.tprint(`${btn.innerText} with ${faction}`)
          break
        }
      }
    }
    // TODO: If we failed to find it, try to figure that out
    //       and bail to the next loop. (If the City button
    //       is available on the sidebar, we already lost
    //       our infiltration, right?)
    await ns.sleep(1000)
    if (find("//button[contains(., 'Start')]")) {
      ns.run("infilitrate.js", 1, "--start");

    }
    if (find("//div[(@role = 'button') and (contains(., 'City'))]")) {
      ns.tprint("Infiltration canceled?")
      return;
    }
  }
  await ns.sleep(1000)
}

// TODO: Share instead of copy-paste from casino
async function click(elem) {
  await elem[Object.keys(elem)[1]].onClick({
    isTrusted: true
  });
}

async function setText(input, text) {
  await input[Object.keys(input)[1]].onChange({
    isTrusted: true,
    target: { value: text }
  });
}

function find(xpath) {
  return doc.evaluate(xpath, doc, null, XPathResult
      .FIRST_ORDERED_NODE_TYPE,
    null)
    .singleNodeValue;
}

async function findRetry(ns, xpath, expectFailure = false, retries = null) {
  try {
    return await autoRetry(
      ns, () => find(xpath), e => e !== undefined,
      () => expectFailure ?
        `It's looking like the element with xpath: ${xpath} isn't present...` :
        `Could not find the element with xpath: ${xpath}\nSomething may have re-routed the UI`,
      retries != null ? retries : expectFailure ? 3 : 10, 1, 2);
  } catch (e) {
    if (!expectFailure) throw e;
  }
}

function notifyMe(message) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check if the user is okay to get some notification
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(message);
  }

    // Otherwise, we need to ask the user for permission
  // So we have to check for NOT 'denied' instead of 'default'
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {

      // Whatever the user answers, we make sure we store the information
      if(!('permission' in Notification)) {
        Notification.permission = permission;
      }

      // If the user is okay, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });
  } else {
    alert(`Permission is ${Notification.permission}`);
  }
}