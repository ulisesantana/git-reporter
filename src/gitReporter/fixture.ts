
export const expectedReport = {
  totalCommits: 17,
  committers: [
    {
      email: 'rlau@redhat.com',
      name: 'Richard Lau',
      totalCommits: 3
    },
    {
      email: 'elad.keyshawn@gmail.com',
      name: 'eladkeyshawn',
      totalCommits: 2
    },
    {
      email: 'duhamelantoine1995@gmail.com',
      name: 'Antoine du Hamel',
      totalCommits: 2
    },
    {
      email: 'targos@protonmail.com',
      name: 'Michaël Zasso',
      totalCommits: 2
    },
    {
      email: 'contact@divlo.fr',
      name: 'divlo',
      totalCommits: 1
    },
    {
      email: 'me@jaydenseric.com',
      name: 'Jayden Seric',
      totalCommits: 1
    },
    {
      email: 'daniel.bevenius@gmail.com',
      name: 'Daniel Bevenius',
      totalCommits: 1
    },
    {
      email: 'rtrott@gmail.com',
      name: 'Rich Trott',
      totalCommits: 1
    },
    {
      email: 'anna@addaleax.net',
      name: 'Anna Henningsen',
      totalCommits: 1
    },
    {
      email: 'and.atencio@gmail.com',
      name: 'Andres',
      totalCommits: 1
    },
    {
      email: 'linkgoron@gmail.com',
      name: 'Nitzan Uziely',
      totalCommits: 1
    },
    {
      email: '62040526+VoltrexMaster@users.noreply.github.com',
      name: 'Voltrex',
      totalCommits: 1
    }
  ]
}

export const expectedReportForMultipleRepositories = {
  totalCommits: expectedReport.totalCommits * 2,
  committers: expectedReport.committers.map(committer => ({
    email: committer.email,
    name: committer.name,
    totalCommits: committer.totalCommits * 2
  }))
}

export const rawGitLog = `
commit f9e07e432b352e3eb6c299df06eaeaa880980ce8
Author: Richard Lau <rlau@redhat.com>
Date:   Sun Apr 18 14:56:24 2021 -0400

    test: add ancestor package.json checks for tmpdir
    
    Policy tests can fail if a \`package.json\` exists in any of the parent
    directories above the test. The existing checks are done for the
    ancestors of the test directory but some tests execute from the tmpdir.
    
    PR-URL: https://github.com/nodejs/node/pull/38285
    Refs: https://github.com/nodejs/node/issues/38088
    Refs: https://github.com/nodejs/node/issues/35600
    Refs: https://github.com/nodejs/node/pull/35633
    Reviewed-By: Rich Trott <rtrott@gmail.com>
    Reviewed-By: Colin Ihrig <cjihrig@gmail.com>
    Reviewed-By: James M Snell <jasnell@gmail.com>

commit 4f11b8b8ae06bf42b483ec7da69ccf7930291056
Author: divlo <contact@divlo.fr>
Date:   Wed Apr 21 03:13:09 2021 +0200

    doc: fix typo in buffer.md
    
    'uint16arr' -> 'uint16array'
    
    PR-URL: https://github.com/nodejs/node/pull/38323
    Reviewed-By: Luigi Pinca <luigipinca@gmail.com>
    Reviewed-By: Darshan Sen <raisinten@gmail.com>

commit 88bc8645e733ee3f9b86272b6c1ae9c1da7790c9
Author: eladkeyshawn <elad.keyshawn@gmail.com>
Date:   Tue Apr 20 14:28:20 2021 +0300

    crypto: fix DiffieHellman \`generator\` validation
    
    PR-URL: https://github.com/nodejs/node/pull/38311
    Fixes: https://github.com/nodejs/node/issues/38302
    Reviewed-By: Antoine du Hamel <duhamelantoine1995@gmail.com>
    Reviewed-By: Luigi Pinca <luigipinca@gmail.com>
    Reviewed-By: James M Snell <jasnell@gmail.com>
    Reviewed-By: Benjamin Gruenbaum <benjamingr@gmail.com>
    Reviewed-By: Minwoo Jung <nodecorelab@gmail.com>
    Reviewed-By: Darshan Sen <raisinten@gmail.com>

commit e151e909fd2918effd9349079d07cd4e7b5c36fb
Author: Antoine du Hamel <duhamelantoine1995@gmail.com>
Date:   Tue Apr 20 11:59:02 2021 +0200

    tls: validate ticket keys buffer
    
    Fixes: https://github.com/nodejs/node/issues/38305
    
    PR-URL: https://github.com/nodejs/node/pull/38308
    Reviewed-By: Darshan Sen <raisinten@gmail.com>
    Reviewed-By: Luigi Pinca <luigipinca@gmail.com>
    Reviewed-By: James M Snell <jasnell@gmail.com>

commit 37b811a27a7479c99448aafa834efab02b6baf17
Author: Jayden Seric <me@jaydenseric.com>
Date:   Wed Apr 21 10:54:38 2021 +1000

    doc: fix YAML comment opening tags
    
    Several YAML documentation comments incorrectly started with \`<!--YAML\`
    instead of \`<!-- YAML\`, resulting in their content missing in the
    rendered documentation.
    
    PR-URL: https://github.com/nodejs/node/pull/38324
    Reviewed-By: Richard Lau <rlau@redhat.com>
    Reviewed-By: Luigi Pinca <luigipinca@gmail.com>
    Reviewed-By: Antoine du Hamel <duhamelantoine1995@gmail.com>
    Reviewed-By: Darshan Sen <raisinten@gmail.com>

commit 63bed545d3054ca952517125c0459356673f5628
Author: Daniel Bevenius <daniel.bevenius@gmail.com>
Date:   Mon Apr 19 05:50:21 2021 +0200

    doc: add nodejs-sec email template
    
    This commit adds a suggestion for a template to be used as part of the
    security release process. One step of this process is to create an email
    to nodejs-sec group and currently would contain a copy and pasted
    version of what is published on nodejs.org. This suggestion is to
    instead use a link to the blog post.
    
    PR-URL: https://github.com/nodejs/node/pull/38290
    Refs: https://github.com/nodejs/node/issues/38143
    Reviewed-By: Michael Dawson <midawson@redhat.com>
    Reviewed-By: James M Snell <jasnell@gmail.com>

commit 8ca373f55707f2502cf1e965cb5f97cc7e8aae3e
Author: Rich Trott <rtrott@gmail.com>
Date:   Thu Apr 22 06:59:19 2021 -0700

    doc: update TSC members list with three new members
    
    PR-URL: https://github.com/nodejs/node/pull/38352
    Reviewed-By: Darshan Sen <raisinten@gmail.com>
    Reviewed-By: Beth Griggs <bgriggs@redhat.com>
    Reviewed-By: Richard Lau <rlau@redhat.com>
    Reviewed-By: James M Snell <jasnell@gmail.com>
    Reviewed-By: Nitzan Uziely <linkgoron@gmail.com>

commit 9f5977a74d99d9caa5361220eaf3d6189e400b0a
Author: Anna Henningsen <anna@addaleax.net>
Date:   Tue Apr 20 16:26:24 2021 +0200

    repl: display prompt once after error callback
    
    Do not call \`.displayPrompt()\` twice after the \`eval\` callback
    resulted in an error.
    
    (This does not affect the default eval because it doesn’t use
    the callback if an error occurs.)
    
    PR-URL: https://github.com/nodejs/node/pull/38314
    Reviewed-By: Luigi Pinca <luigipinca@gmail.com>
    Reviewed-By: Benjamin Gruenbaum <benjamingr@gmail.com>
    Reviewed-By: James M Snell <jasnell@gmail.com>
    Reviewed-By: Colin Ihrig <cjihrig@gmail.com>

commit 4243ce03182aea72aefdd2ff29ecc1affbc59716
Author: Andres <and.atencio@gmail.com>
Date:   Tue Apr 13 23:30:12 2021 -0300

    test: replace function with arrow function and remove unused argument
    
    PR-URL: https://github.com/nodejs/node/pull/38235
    Reviewed-By: Yash Ladha <yash@yashladha.in>
    Reviewed-By: Pooja D P <Pooja.D.P@ibm.com>
    Reviewed-By: Harshitha K P <harshitha014@gmail.com>
    Reviewed-By: Benjamin Gruenbaum <benjamingr@gmail.com>
    Reviewed-By: Rich Trott <rtrott@gmail.com>
    Reviewed-By: Darshan Sen <raisinten@gmail.com>
    Reviewed-By: Colin Ihrig <cjihrig@gmail.com>
    Reviewed-By: Luigi Pinca <luigipinca@gmail.com>
    Reviewed-By: James M Snell <jasnell@gmail.com>
    Reviewed-By: Antoine du Hamel <duhamelantoine1995@gmail.com>

commit 5370220ab2e8978611a827ac11aba1318bb93969
Author: Nitzan Uziely <linkgoron@gmail.com>
Date:   Sun Apr 18 22:40:59 2021 +0300

    fs: allow no-params fsPromises fileHandle read
    
    allow no-params read for fsPromises fileHandle read
    
    PR-URL: https://github.com/nodejs/node/pull/38287
    Reviewed-By: Anna Henningsen <anna@addaleax.net>
    Reviewed-By: Antoine du Hamel <duhamelantoine1995@gmail.com>
    Reviewed-By: Colin Ihrig <cjihrig@gmail.com>
    Reviewed-By: Rich Trott <rtrott@gmail.com>
    Reviewed-By: Darshan Sen <raisinten@gmail.com>
    Reviewed-By: Luigi Pinca <luigipinca@gmail.com>

commit 7264dbd038c90ca5524974d7d4705d1d4b692e15
Author: Antoine du Hamel <duhamelantoine1995@gmail.com>
Date:   Mon Apr 12 17:36:24 2021 +0200

    bootstrap: freeze more intrinsics
    
    PR-URL: https://github.com/nodejs/node/pull/38217
    Reviewed-By: Guy Bedford <guybedford@gmail.com>

commit 6e3f98569cafd45c55a156906f934cec21d94d35
Author: eladkeyshawn <elad.keyshawn@gmail.com>
Date:   Fri Apr 9 20:12:59 2021 +0300

    tls: fix \`tlsSocket.setMaxSendFragment\` abort
    
    PR-URL: https://github.com/nodejs/node/pull/38170
    Fixes: https://github.com/nodejs/node/issues/38169
    Reviewed-By: Benjamin Gruenbaum <benjamingr@gmail.com>
    Reviewed-By: Luigi Pinca <luigipinca@gmail.com>
    Reviewed-By: James M Snell <jasnell@gmail.com>

commit 8cb6b5d2a10979684846df11f4d6e937aae105ba
Author: Voltrex <62040526+VoltrexMaster@users.noreply.github.com>
Date:   Fri Apr 2 04:25:38 2021 +0430

    doc: use \`foo.prototype.bar\` notation in buffer.md
    
    Most of the documentation uses \`foo.prototype.bar\` notation instead of
    \`foo#bar\` notation, this commit apply the former in \`buffer.md\`.
    
    PR-URL: https://github.com/nodejs/node/pull/38032
    Reviewed-By: Derek Lewis <DerekNonGeneric@inf.is>
    Reviewed-By: Antoine du Hamel <duhamelantoine1995@gmail.com>
    Reviewed-By: Colin Ihrig <cjihrig@gmail.com>
    Reviewed-By: Darshan Sen <raisinten@gmail.com>

commit 8645a3610e1b2eb89fdb96ae795017ec239410c8
Author: Richard Lau <rlau@redhat.com>
Date:   Sun Apr 18 15:32:12 2021 -0400

    test: use .test domain for not found address
    
    While it is extremely unlikely that \`.fhqwhgads\` will become a valid
    domain, we should, where possible, use one of the reserved domains for
    testing.
    
    Refs: https://tools.ietf.org/html/rfc2606
    
    PR-URL: https://github.com/nodejs/node/pull/38286
    Refs: https://github.com/nodejs/node/pull/38282
    Reviewed-By: Colin Ihrig <cjihrig@gmail.com>
    Reviewed-By: Rich Trott <rtrott@gmail.com>
    Reviewed-By: Luigi Pinca <luigipinca@gmail.com>

commit e703ceb8b48befa2097bb11943293706835834bc
Author: Richard Lau <rlau@redhat.com>
Date:   Sun Apr 18 19:21:22 2021 -0400

    tools: fix type mismatch in test runner
    
    \`output.diagnostic\` is a list that is appended to on SmartOS when
    retrying a test due to \`ECONNREFUSED\`. The test runner checks if
    \`output.diagnostic\` is truthy and, if so, assigns its value to
    \`self.traceback\`. However \`self.traceback\` is supposed to be a string,
    and \`_printDiagnostic()\` in the \`TapProgressIndicator\` attempts to call
    \`splitlines()\` on it, which fails if it is a list with:
    AttributeError: 'list' object has no attribute 'splitlines'
    
    PR-URL: https://github.com/nodejs/node/pull/38289
    Reviewed-By: Rich Trott <rtrott@gmail.com>
    Reviewed-By: Christian Clauss <cclauss@me.com>
    Reviewed-By: Luigi Pinca <luigipinca@gmail.com>
    Reviewed-By: Benjamin Gruenbaum <benjamingr@gmail.com>

commit 053aa6d213ea828fac89864df03890228831db7e
Author: Michaël Zasso <targos@protonmail.com>
Date:   Sat Apr 17 09:36:55 2021 +0200

    deps: patch V8 to 9.0.257.19
    
    Refs: https://github.com/v8/v8/compare/9.0.257.17...9.0.257.19
    
    PR-URL: https://github.com/nodejs/node/pull/38270
    Reviewed-By: Colin Ihrig <cjihrig@gmail.com>
    Reviewed-By: Rich Trott <rtrott@gmail.com>

commit 614efb1bc2042725f847d4161cf8ae126483a7af
Author: Michaël Zasso <targos@protonmail.com>
Date:   Wed Apr 21 17:27:03 2021 +0200

    test: update trace events test expectations
    
    V8 9.2 doesn't emit the "V8.ScriptCompiler" event anymore.
    Use "V8.GCScavenger" instead.
`
