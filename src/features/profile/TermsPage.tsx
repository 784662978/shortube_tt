import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function TermsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-10 bg-brand-bg/95 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-[480px] mx-auto px-4 h-12 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-brand-surface flex items-center justify-center hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-brand-text" />
          </button>
          <h1 className="text-lg font-semibold text-brand-text font-sora">
            Terms of Service
          </h1>
        </div>
      </header>

      {/* 内容 */}
      <div className="max-w-[480px] mx-auto px-4 py-6">
        <div className="prose prose-invert prose-sm max-w-none space-y-4 text-brand-muted text-sm leading-relaxed">
          <p>
            Welcome to the Shortube platform, which is owned and operated by SUNFLOWER ENTERTAINMENT CO.,
            LIMITED. These terms of service (which includes our Privacy Policy) ("Terms of Service") are a
            contract between you and Shortube. If you don't agree to any of these terms, you can't use the
            Shortube Services.
          </p>

          <h2 className="text-lg font-semibold text-brand-text font-sora">
            A. Your Acceptance of the Terms of Use
          </h2>
          <p>
            You affirm that you are 13 years of age or older, and competent to enter into the terms,
            conditions, obligations, affirmations, representations, and warranties set forth in these
            Terms of Service, and to abide by and comply with these Terms of Service.
          </p>
          <p>
            In any case, you affirm that you are 13 or older, as the Service is not intended for people
            under 13. If you are under 13 years of age, then please do not use the Service.
          </p>

          <h2 className="text-lg font-semibold text-brand-text font-sora">
            B. Shortube User Accounts
          </h2>
          <p>
            You're responsible for all the activity on your account, and for keeping your password
            confidential. If you share your account information with anyone, that other person may be able
            to take control of the account, and we may not be able to determine who is the proper account
            holder. We will not have any liability to you (or anyone you share your account information
            with) as a result of your or their actions under those circumstances. If you find out that
            someone's used your account without your permission, you should report it at
            sandy@sunflowershort.com.
          </p>

          <h2 className="text-lg font-semibold text-brand-text font-sora">
            C. Your Content and Conduct
          </h2>
          <p>
            You shall be solely responsible for your own Content and the consequences of submitting and
            publishing your Content on a Shortube Service.
          </p>
          <p>
            You hereby affirm, represent, and warrant that you (1) own or have the necessary licenses,
            rights, consents, and permissions to publish Content you submit and publish through the
            Service; and (2) all such Content are original works of authorship on your part and have not
            been copied, in whole or in part, from any other work and do not violate, misappropriate or
            infringe any copyright, trademark or other proprietary right of any other person or entity.
          </p>
          <p>
            You further agree that Content you submit to a Shortube Service will not contain third party
            copyrighted material, or material that is subject to other third party proprietary rights,
            unless you have permission from the rightful owner of the Content or you are otherwise legally
            entitled to post the Content and to grant Shortube all of the license rights granted herein.
            You further agree that you will not submit to the Service any Content or other material that
            is contrary to applicable local, national, and international laws and regulations.
          </p>
          <p>
            Shortube does not endorse any Content submitted to the Service by any user or other licensor,
            or any opinion, recommendation, or advice expressed therein, and Shortube expressly disclaims
            any and all liability in connection with Content. Shortube does not permit copyright infringing
            activities and infringement of intellectual property rights on the Service, and Shortube will
            remove all Content if properly notified that such Content infringes on another's intellectual
            property rights. Shortube reserves the right to remove Content without prior notice.
          </p>

          <h2 className="text-lg font-semibold text-brand-text font-sora">
            D. Our Rights in the Services
          </h2>
          <p>
            We reserve all rights in the Sites' and the Services look and feel, and in our content. You
            may not copy or adapt any portion of our code or visual design elements (including logos)
            without express written permission from Shortube or as set out in this clause. Please do not
            use our logo or trademarks in any way that might suggest Shortube endorses a particular
            product or service, or you have a business relationship with Shortube. Please do not alter,
            stretch, condense, embellish, add sparkles to, or otherwise change our logo in any way.
          </p>
          <p>
            Shortube may change, terminate, or restrict access to any aspect of the Services, at any time,
            without notice. We can remove any content you post or submit for any reason. Shortube may
            access, read, preserve, and disclose any information as we reasonably believe is necessary to:
          </p>
          <p>(1) satisfy any applicable law, regulation, legal process or governmental request,</p>
          <p>
            (2) enforce the Terms of Service, including investigation of potential violations,
          </p>
          <p>(3) detect, prevent, or otherwise address fraud, security or technical issues,</p>
          <p>(4) respond to user support requests, or</p>
          <p>(5) protect the rights, property or safety of the Services, its users and the public.</p>

          <h2 className="text-lg font-semibold text-brand-text font-sora">
            E. Copyright Violations
          </h2>
          <p>
            All videos included in the platform are original content or legally authorized by our
            partners, and should not be replicated without permission. If you want to replicate any
            content, please contact us in advance and obtain authorization before you do so, to avoid
            infringement.
          </p>
          <p>
            Shortube has adopted a policy toward copyright infringement on the Services in accordance with
            the United States Digital Millennium Copyright Act (the "DMCA"). If you'd like to submit a
            claim of copyright infringement, please send an email with the subject line "Copyright" to
            sandy@sunflowershort.com. Shortube reserves the right to remove content alleged to be
            infringing without prior notice, at our sole discretion, and without liability to you or
            anyone else. In appropriate circumstances, we will also terminate a user's account if the user
            is determined to be a repeat infringer.
          </p>
          <p>
            We sometimes come across websites that have illegally scraped content from Shortube. When we
            find these sites we do our best to defend our rights. In order to act on behalf of our users
            we need to have your legal permission to do that so we ask for it here. You authorize us to
            act as your agent to issue take down notices under the DMCA and/or any other similar
            legislation that allows for the submission of requests to Internet service providers and any
            other person involved in the illegal posting for the removal of infringing or allegedly
            infringing copyright materials that are contained in or displayed on such service providers
            platforms and/or services.
          </p>

          <h2 className="text-lg font-semibold text-brand-text font-sora">
            F. Things You Should and Shouldn't Do
          </h2>
          <p>
            We expect all of users to behave responsibly and help keep Shortube platform a nice place. To
            create a safe, fun and caring environment for story lovers, don't do any of these things on
            the Services:
          </p>
          <p>
            Don't break the law. Don't take any action that infringes or violates other people's rights,
            violates the law, or breaches any contract or legal duty you have toward anyone.
          </p>
          <p>
            Don't harm anyone's computer. Don't distribute software viruses, or anything else (code,
            films, programs) designed to interfere with the proper function of any software, hardware, or
            equipment on the Site (whether it belongs to Shortube or anyone else).
          </p>
          <p>
            Don't try to damage or disrupt Shortube. Don't try to interfere with the proper workings of
            the Services. Don't bypass any measures we've put in place to secure the Services. Don't try
            to damage or get unauthorized access to any system, data, password, or other information.
            Don't take any action that imposes an unreasonable load on our infrastructure, or on our
            third-party providers. (We determine what's reasonable.)
          </p>
          <p>
            Don't scrape Shortube. Don't use any kind of software, device or method (whether it's manual
            or automated) to "crawl", "spider" or otherwise remove any content from any part of the Site
            or Services. Don't make any use of the Site, content or Services that may have the effect of
            competing with or displacing the market for Shortube, the Site, or the Services.
          </p>
          <p>
            Don't steal any content from Shortube without permission. Don't change, translate, reproduce,
            distribute or otherwise create derivative works of any content unless you get explicit consent
            from the author of that content.
          </p>
          <p>
            Don't steal Shortube's valuable intellectual property. Don't take apart or reverse engineer
            any aspect of the Site or Services in an effort to access things like source code, underlying
            ideas, or algorithms.
          </p>
          <p>
            Don't make any commercial use of Shortube. Shortube is for your personal and non-commercial
            use only. Don't sell access to the Site or Services in any way. Don't use the Site or Services
            for the purpose of advertising any goods or services.
          </p>

          <h2 className="text-lg font-semibold text-brand-text font-sora">
            G. Virtual Currency and Purchases
          </h2>
          <p>
            While viewing content on one or more of Shortube's platforms, you may have the opportunity to
            visit an in-app or online store. From there you may have the opportunity to use an online
            "currency" to access a variety of virtual goods such as episodes of a story. You may also be
            awarded virtual Coins or other currency to use for virtual "shopping." These currencies have
            no "real world" value, but may be exchanged by you for designated items. Certain items have an
            expiration date, while others have no expiration date. Each item that you obtain using virtual
            currency will be included in your account until the earlier of that item's expiration date,
            your account's expiration or termination date, or such date when the platform is discontinued.
            REGARDLESS OF THE CONSIDERATION OFFERED OR PAID IN EXCHANGE FOR VIRTUAL CURRENCY, YOU DO NOT
            HAVE ANY OWNERSHIP RIGHTS IN THE ITEMS OBTAINED WITH VIRTUAL CURRENCY.
          </p>
          <p>
            Shortube has no liability for loss of your items from your account, provided we will use
            reasonable efforts to replace such items under certain circumstances in our reasonable
            discretion. We have no obligation or responsibility to and will not reimburse you for any item
            or any experience lost due to your violations of this and any other rules, policies, notices
            and/or agreements. Price and availability of the items are subject to change without notice.
            You agree that you cannot and have no right to sell or otherwise transfer any of the items,
            virtual currency or any other content or information included in any Shortube platform, in
            whole or in part, to any third person or entity whatsoever in return for anything of value
            (including "real" money) or otherwise. You acknowledge that any virtual currency you receive
            on any of Shortube's platforms is not "real" currency or any type of real world financial
            instrument. Furthermore it is not redeemable for any sum of money from Shortube at any time.
          </p>
          <p>
            Shortube thanks you for supporting our services. Without your purchases and participation
            Shortube would not be able to provide you with the services we have built and improved. Your
            purchases and trust are very important to us and we want your experience to be the best it can
            be.
          </p>
          <p>
            In some instances Shortube does not own the content we license to our readers. That being the
            case there may be times when content you have paid to be able to view is removed from our
            platform by the content owners before you have had a chance to view it. If this happens, and
            if you have made a purchase to view content that is removed within 7 days of your purchase,
            please contact sandy@sunflowershort.com with the subject CONTENT REMOVED BEFORE VIEWED and we
            will work with you to exchange your unlocked, unread episodes for Shortube Coins.
          </p>

          <h2 className="text-lg font-semibold text-brand-text font-sora">
            H. Deleting Your Account
          </h2>
          <p>
            You have the right to opt out of the Services at anytime by sending a written notification
            with the subject line "Opt Out Notice" to Shortube via email at sandy@sunflowershort.com. We
            may suspend or terminate your account or cease providing you with all or part of the Services
            at any time and for any reason we deem appropriate. We will make reasonable efforts to notify
            you by the email address associated with your account, through in-app Messages, or the next
            time you attempt to access your account.
          </p>

          <h2 className="text-lg font-semibold text-brand-text font-sora">
            I. Disclaimers, Limitations of Liability and Indemnification
          </h2>
          <p>
            Each of the subsections below only applies up to the maximum extent permitted under applicable
            law. Some jurisdictions do not allow the disclaimer of implied warranties or the limitation of
            liability in contracts, and as a result the contents of this section may not apply to you.
            Nothing in this section is intended to limit any rights you may have which may not be lawfully
            limited.
          </p>
          <p>
            <strong>No warranty.</strong> Your use of our Services and any content is solely at your own
            risk and discretion. They are provided to you "as is" and "as available". That means they
            don't come with any warranty of any kind, express or implied. Shortube specifically disclaims
            any implied warranty of merchantability, merchantable quality, fitness for a particular
            purpose, availability, security, title or non-infringement, and any warranties implied by any
            course of dealing or performance.
          </p>
          <p>
            <strong>Responsibility for Content.</strong> All content, whether publicly posted or privately
            transmitted, is the sole responsibility of the person who originated such content. We may not
            monitor or control the content posted via the Services and we cannot take responsibility for
            such content. We do not endorse, support, represent or guarantee the completeness,
            truthfulness, accuracy, or reliability of any content or communications posted via the
            Services or endorse any opinions expressed via the Services. You understand that by using the
            Services, you may be exposed to content that might be offensive, harmful, inaccurate or
            otherwise inappropriate, or in some cases, postings that have been mislabeled or are otherwise
            deceptive.
          </p>
          <p>
            <strong>Release.</strong> When you use the Services, you release Shortube from claims,
            damages, and demands of every kind -- known or unknown, suspected or unsuspected, disclosed or
            undisclosed -- arising out of or in any way related to (1) disputes between users, or between
            users and any third party relating to the use of the Services and (2) the Services.
          </p>
          <p>
            <strong>Shortube's liability to you.</strong> Shortube won't be liable to you for any damages
            that arise from your use of, or in connection with, the Services and any content. This
            exclusion includes: (1) where the Services are hacked or unavailable, (2) all types of
            damages (direct, indirect, punitive, incidental, consequential, special or exemplary),
            whatever the type of claim or loss (breach of contract, tort (including negligence), breach of
            warranty, or any other claim or loss), (3) any lost profits, data or revenues, or (4) any
            conduct or content of other users or third parties on the Site or the Services. In no event
            shall Shortube's liability for damages be in excess of (in the aggregate) one hundred United
            States dollars ($100.00).
          </p>

          <h2 className="text-lg font-semibold text-brand-text font-sora">
            J. Your Liability to Shortube
          </h2>
          <p>
            If you do something that gets us sued, or break any of the promises you make in these Terms of
            Service, you shall compensate us for any liabilities, losses, claims, and expenses (including
            reasonable legal fees and costs) that arise from or relate to your use or misuse of the
            Services. We reserve the right to assume the exclusive defense and control of any matter
            otherwise subject to this clause, in which case you agree that you'll cooperate and help us in
            asserting any defenses.
          </p>
          <p>
            <strong>Third party websites.</strong> The Site and Services may contain links to other
            websites; for instance, stories, user profiles, and other posts may link to other sites. When
            you access third-party websites, you do so at your own risk. We don't control or endorse those
            sites.
          </p>

          <h2 className="text-lg font-semibold text-brand-text font-sora">
            K. Serving Ads
          </h2>
          <p>
            We offer several methods to let some users access the Services without charge. To be able to
            continue to do so, we display third party advertisements and promotions on or in connection
            with the Service. Since the advertising we provide is based upon information provided by third
            parties, we will not be responsible or liable for any loss or damage of any sort incurred by
            you as a result of any advertisements. Your interactions with advertisers found on or through
            the Service, including, without limitation, all reliance upon advertising, all commercial
            transactions and legal obligations associated with such advertisements, are solely between you
            and the advertisers.
          </p>
          <p>
            If you wish to find out more information about how your personal information may be used by
            these third party advertisers, please visit Privacy Policy.
          </p>

          <h2 className="text-lg font-semibold text-brand-text font-sora">
            L. General Terms
          </h2>
          <p>
            <strong>Changes.</strong> Our Terms of Service may change from time to time. If they do, we'll
            let you know about any material changes, either by notifying you on the Site or by sending you
            an email. Please note that your continued use of the Services after any change means that you
            agree with, and consent to be bound by, the new Terms of Service. If you disagree with any
            changes in the Terms of Service and do not wish to be subject to the revised terms, you will
            need to close your account and/or stop using the Services.
          </p>
          <p>
            <strong>Entire agreement.</strong> These Terms of Service (including any document incorporated
            by reference into them) are the whole agreement between Shortube and you concerning the
            Services, and these Terms of Service supersede and replace any prior agreements between
            Shortube and you regarding the Services.
          </p>
          <p>
            <strong>No waiver and severability.</strong> If Shortube doesn't exercise or enforce a
            particular right or provision under these Terms of Service, that doesn't mean we've waived
            that right or provision. If any provision of these Terms of Service is held to be invalid or
            unenforceable, then that provision will be limited or eliminated to the minimum extent
            necessary, and the remaining provisions of these Terms of Service will remain in full force
            and effect.
          </p>
          <p>
            <strong>Choice of law and jurisdiction.</strong> We at Shortube encourage you to contact us if
            you're having an issue, before resorting to the courts. In the unfortunate situation where
            legal action does arise, these Terms of Service shall be governed by and interpreted in
            accordance with the laws of the People's Republic of China that apply in China, without regard
            to principles of conflicts of laws. You agree that any dispute or claim arising out of or in
            connection with these Terms of Service will take place in Fuzhou Gulou People's Court.
          </p>

          <h2 className="text-lg font-semibold text-brand-text font-sora">
            M. Assignment
          </h2>
          <p>
            These Terms of Service are personal to you. You can't assign them, transfer them, or
            sublicense them unless you get Shortube's prior written consent. Shortube has the right to
            assign, transfer, or delegate any of its rights and obligations under these Terms of Service
            without notice and without your consent.
          </p>

          <h2 className="text-lg font-semibold text-brand-text font-sora">
            N. Contact
          </h2>
          <p>
            For questions about these Terms of Service, send an e-mail to sandy@sunflowershort.com.
          </p>

          <h2 className="text-lg font-semibold text-brand-text font-sora">
            O. Recharge Rules
          </h2>
          <p>
            Users understand and agree that the virtual currency of the recharge product is not applicable
            to unconditional return policy, and users shall not ask for a refund on the grounds that there
            are still remaining Coins/ Free Coins in the account after consumption. When users recharge in
            this App, users must carefully confirm their account information. If users' rights and
            interests are harmed due to their improper operations such as choosing the wrong account number
            or wrong recharge type, they shall not require any compensation from the App.
          </p>

          <p className="text-brand-muted/50 text-xs pt-4">
            © 2024 SUNFLOWER ENTERTAINMENT CO., LIMITED. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
