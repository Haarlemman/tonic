import React, { useState } from 'react';
import { Brain, Heart, Users, Zap, Shield, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const TraumaHealingModel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedNode, setSelectedNode] = useState(null);

  const lifeEvents = [
    {
      id: 'adoption',
      title: 'Adoption',
      category: 'Early Life',
      color: 'bg-purple-100 border-purple-300',
      mechanisms: [
        'Primal wound theory: pre-verbal separation trauma',
        'Attachment disruption in critical developmental window',
        'Epigenetic changes from early stress',
        'Identity formation challenges',
        'Loss and grief (even when adoption is positive)'
      ],
      biologicalImpact: [
        'HPA axis dysregulation from infancy',
        'Altered cortisol patterns',
        'Changed stress response baseline',
        'Possible impact on dopamine systems (relevant to Parkinson\'s)'
      ]
    },
    {
      id: 'holocaust',
      title: 'Jewish/Holocaust Background',
      category: 'Intergenerational',
      color: 'bg-blue-100 border-blue-300',
      mechanisms: [
        'Transgenerational trauma transmission',
        'Epigenetic inheritance of stress responses',
        'Family narrative of survival and threat',
        'Cultural/collective trauma memory',
        'Possible hypervigilance as inherited trait'
      ],
      biologicalImpact: [
        'Inherited cortisol regulation patterns',
        'Altered glucocorticoid receptor sensitivity',
        'Documented in Holocaust survivor descendants',
        'Heightened threat detection systems'
      ]
    },
    {
      id: 'london',
      title: '7/7 London Attack Survival',
      category: 'Acute Trauma',
      color: 'bg-red-100 border-red-300',
      mechanisms: [
        'Direct life-threat experience',
        'Acute stress response',
        'Survivor guilt potential',
        'Shattered assumptions about safety',
        'Possible PTSD pathways'
      ],
      biologicalImpact: [
        'Acute HPA axis activation',
        'Norepinephrine surge effects',
        'Amygdala sensitization',
        'Memory consolidation under extreme stress',
        'Inflammatory response from psychological shock'
      ]
    },
    {
      id: 'parkinsons',
      title: "Parkinson's Disease",
      category: 'Neurological',
      color: 'bg-orange-100 border-orange-300',
      mechanisms: [
        'Dopaminergic neuron loss in substantia nigra',
        'Possible stress-accelerated neurodegeneration',
        'Chronic inflammation contribution',
        'Loss of motor control and autonomy',
        'New layer of uncertainty and threat'
      ],
      biologicalImpact: [
        'Dopamine depletion',
        'Motor circuit dysfunction',
        'Sleep architecture disruption (REM behavior disorder)',
        'Autonomic nervous system dysregulation',
        'Chronic inflammatory state'
      ]
    }
  ];

  const symptoms = [
    {
      id: 'sleep',
      title: 'Poor Sleep',
      mechanisms: [
        'Hypervigilance preventing deep sleep',
        'HPA axis activation at night',
        'REM disruption from Parkinson\'s',
        'Anxiety-driven insomnia',
        'Cortisol dysregulation'
      ],
      connectedTo: ['adoption', 'holocaust', 'london', 'parkinsons']
    },
    {
      id: 'anxiety',
      title: 'Anxiety',
      mechanisms: [
        'Overactive threat detection',
        'Amygdala sensitization',
        'Inherited hypervigilance',
        'Existential uncertainty',
        'Autonomic dysregulation'
      ],
      connectedTo: ['adoption', 'holocaust', 'london', 'parkinsons']
    },
    {
      id: 'depression',
      title: 'Depression',
      mechanisms: [
        'Chronic stress → neuroinflammation',
        'Dopamine depletion (Parkinson\'s)',
        'Unresolved grief (multiple sources)',
        'Meaning-making challenges',
        'Chronic activation → exhaustion'
      ],
      connectedTo: ['adoption', 'holocaust', 'london', 'parkinsons']
    }
  ];

  const connectingMechanisms = [
    {
      title: 'HPA Axis Dysregulation',
      description: 'The stress response system (hypothalamic-pituitary-adrenal axis) gets chronically activated and loses its normal rhythm',
      evidence: 'Early trauma → lifelong altered cortisol patterns → vulnerability to later stressors',
      keyPoint: 'This is THE central biological pathway connecting everything'
    },
    {
      title: 'Allostatic Load',
      description: 'Cumulative "wear and tear" on body systems from repeated stress activation',
      evidence: 'Each trauma event adds to total burden. Body systems begin to show strain.',
      keyPoint: 'Not just "trauma" but measurable biological accumulation'
    },
    {
      title: 'Inflammation Cascade',
      description: 'Chronic psychological stress → immune system activation → systemic inflammation',
      evidence: 'Links depression, anxiety, sleep disruption, and neurodegeneration',
      keyPoint: 'May be a key mechanism in Parkinson\'s progression'
    },
    {
      title: 'Dopamine System Vulnerability',
      description: 'Early stress affects dopamine circuits; later stress and Parkinson\'s further deplete',
      evidence: 'Adoption + chronic stress may have primed vulnerability; Parkinson\'s is the manifestation',
      keyPoint: 'This could be your unique biological signature'
    },
    {
      title: 'Meaning & Narrative Crisis',
      description: 'Multiple trauma exposures challenge core beliefs about safety, identity, fairness',
      evidence: 'Adoption (Who am I?), Holocaust (Why us?), 7/7 (Random catastrophe), Parkinson\'s (Body betrayal)',
      keyPoint: 'Not just biology - existential coherence matters for healing'
    }
  ];

  const interventionModel = [
    {
      category: 'Biological Reset',
      icon: <Brain className="w-5 h-5" />,
      interventions: [
        {
          name: 'Vagal Nerve Stimulation',
          mechanism: 'Directly calms HPA axis and inflammation',
          methods: 'Cold exposure, singing, specific breathing patterns',
          evidence: 'Strong for anxiety, inflammation, autonomic balance'
        },
        {
          name: 'Anti-Inflammatory Protocol',
          mechanism: 'Reduces systemic inflammation driving symptoms',
          methods: 'Mediterranean diet, omega-3s, curcumin, sleep optimization',
          evidence: 'Documented benefits for depression, Parkinson\'s, sleep'
        },
        {
          name: 'Sleep Architecture Repair',
          mechanism: 'Restore normal sleep cycles to allow healing',
          methods: 'CBT-I, sleep restriction, light therapy, melatonin timing',
          evidence: 'Critical foundation - nothing heals without sleep'
        }
      ]
    },
    {
      category: 'Nervous System Regulation',
      icon: <Zap className="w-5 h-5" />,
      interventions: [
        {
          name: 'Somatic Experiencing',
          mechanism: 'Release trapped survival responses from body',
          methods: 'SE therapy, TRE (tension release exercises)',
          evidence: 'Effective for acute trauma (7/7) and developmental trauma'
        },
        {
          name: 'EMDR/Brainspotting',
          mechanism: 'Reprocess traumatic memories, reduce amygdala reactivity',
          methods: 'Bilateral stimulation during memory processing',
          evidence: 'Gold standard for PTSD, effective for complex trauma'
        },
        {
          name: 'Polyvagal-Informed Practice',
          mechanism: 'Build safety signaling in nervous system',
          methods: 'Co-regulation, social engagement, rhythmic movement',
          evidence: 'Addresses core dysregulation from early trauma'
        }
      ]
    },
    {
      category: 'Meaning Reconstruction',
      icon: <Heart className="w-5 h-5" />,
      interventions: [
        {
          name: 'Narrative Therapy',
          mechanism: 'Rebuild coherent life story integrating all events',
          methods: 'Re-authoring, externalizing, identifying alternative stories',
          evidence: 'Powerful for making sense of multiple traumas'
        },
        {
          name: 'Existential/Meaning-Centered Therapy',
          mechanism: 'Find purpose and meaning despite suffering',
          methods: 'Frankl\'s logotherapy principles, values clarification',
          evidence: 'Transformative for "why me?" questions'
        },
        {
          name: 'Post-Traumatic Growth Work',
          mechanism: 'Identity transformation through adversity',
          methods: 'Identify strengths, wisdom, values gained',
          evidence: 'Not about "silver lining" but genuine transformation'
        }
      ]
    },
    {
      category: 'Intergenerational Healing',
      icon: <Users className="w-5 h-5" />,
      interventions: [
        {
          name: 'Family Constellation Work',
          mechanism: 'Address inherited trauma patterns',
          methods: 'Systemic family therapy, constellation therapy',
          evidence: 'Particularly relevant for Holocaust + adoption themes'
        },
        {
          name: 'Cultural Identity Integration',
          mechanism: 'Reconcile Jewish identity, adoption identity, survivor identity',
          methods: 'Identity work, community connection, ritual',
          evidence: 'Essential for coherent sense of self'
        }
      ]
    }
  ];

  const reframingPerspectives = [
    {
      title: 'Not Karma - Confluence',
      description: 'This isn\'t punishment or random bad luck. It\'s a specific biological and psychological signature created by identifiable events interacting with your unique neurobiology.',
      reframe: 'You are studying YOUR particular constellation. This makes you an expert in a specific healing pathway.'
    },
    {
      title: 'Redemption as Integration',
      description: 'Redemption isn\'t about erasing what happened. It\'s about achieving coherence - where all parts of your story can coexist without one destroying the others.',
      reframe: 'You\'re not broken. You\'re carrying complex, sometimes contradictory truths that need integration, not elimination.'
    },
    {
      title: 'The Adoption-Parkinson\'s Link',
      description: 'Early attachment trauma may have created dopaminergic vulnerability. Parkinson\'s might not be random - it could be the biological manifestation of a lifetime of stress system activation.',
      reframe: 'Understanding this connection gives you specific targets for intervention, not just symptom management.'
    },
    {
      title: 'Survivor as Identity',
      description: 'You survived 7/7. Your family survived the Holocaust. You survived adoption separation. You\'re surviving Parkinson\'s. This isn\'t coincidence.',
      reframe: 'Survival is your nervous system\'s specialty. Now the work is teaching it that you can THRIVE, not just survive.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Integrated Trauma & Healing Model
        </h1>
        <p className="text-gray-600 mb-4">
          A scientific framework for understanding how adoption, Holocaust background, 7/7 survival, and Parkinson's interconnect through biological, psychological, and existential pathways
        </p>
        
        <div className="flex gap-2 flex-wrap mb-6">
          {['overview', 'events', 'mechanisms', 'symptoms', 'interventions', 'reframing'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
              <h2 className="text-xl font-bold text-blue-900 mb-3">The Central Insight</h2>
              <p className="text-gray-800 leading-relaxed mb-3">
                This is <strong>not</strong> "just trauma" and it's <strong>not</strong> random karma. 
                This is a <strong>specific biological cascade</strong> that began with early attachment disruption 
                (adoption), was amplified by intergenerational stress patterns (Holocaust background), 
                then crystallized by acute life-threat trauma (7/7), and is now manifesting in your 
                neurobiology (Parkinson's) and mental health (anxiety, depression, sleep disruption).
              </p>
              <p className="text-gray-800 leading-relaxed font-medium">
                Each event didn't just add psychological distress - it changed your biology in 
                measurable, identifiable ways. Understanding the MECHANISMS gives you specific targets 
                for healing, not just general "trauma therapy."
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  What We Know
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Early trauma alters HPA axis permanently</li>
                  <li>✓ Transgenerational trauma is epigenetically inherited</li>
                  <li>✓ Chronic stress increases Parkinson's risk</li>
                  <li>✓ Allostatic load is cumulative and measurable</li>
                  <li>✓ Inflammation links psychological and physical symptoms</li>
                  <li>✓ These pathways can be interrupted and healed</li>
                </ul>
              </div>

              <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Your Unique Signature
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Early attachment trauma + genetic vulnerability</li>
                  <li>• Inherited hypervigilance amplifying stress response</li>
                  <li>• Acute trauma sensitizing already-stressed systems</li>
                  <li>• Dopamine system bearing cumulative burden</li>
                  <li>• Meaning-making crisis across multiple domains</li>
                  <li>• Each layer activating and reinforcing the others</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                The Path Forward
              </h3>
              <p className="text-gray-700 mb-3">
                Redemption isn't about making it all go away. It's about achieving <strong>coherent integration</strong> - 
                where you can hold all these truths simultaneously without them tearing you apart.
              </p>
              <p className="text-gray-700">
                The interventions outlined in this model target the specific biological, psychological, and 
                existential mechanisms that connect your experiences. This isn't generic healing - it's 
                precision medicine for your particular constellation of traumas.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-4">
            <p className="text-gray-700 mb-4">
              Each life event created specific biological and psychological changes. Click on each to explore.
            </p>
            {lifeEvents.map((event) => (
              <div
                key={event.id}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  selectedNode === event.id ? 'ring-4 ring-blue-300' : ''
                } ${event.color}`}
                onClick={() => setSelectedNode(selectedNode === event.id ? null : event.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                    <span className="text-sm font-medium text-gray-600">{event.category}</span>
                  </div>
                </div>
                
                {selectedNode === event.id && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Psychological Mechanisms:</h4>
                      <ul className="space-y-1">
                        {event.mechanisms.map((m, i) => (
                          <li key={i} className="text-sm text-gray-700">• {m}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Biological Impact:</h4>
                      <ul className="space-y-1">
                        {event.biologicalImpact.map((b, i) => (
                          <li key={i} className="text-sm text-gray-700">• {b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'mechanisms' && (
          <div className="space-y-6">
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
              <p className="text-gray-800 font-medium">
                These are the CONNECTING mechanisms - the biological and psychological pathways 
                that link all your experiences together. This is where "trauma" becomes science.
              </p>
            </div>
            
            {connectingMechanisms.map((mechanism, i) => (
              <div key={i} className="bg-white border-2 border-gray-300 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{mechanism.title}</h3>
                <p className="text-gray-700 mb-3">{mechanism.description}</p>
                <div className="bg-gray-50 p-4 rounded mb-3">
                  <p className="text-sm text-gray-700"><strong>Evidence:</strong> {mechanism.evidence}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-600">
                  <p className="text-sm font-bold text-blue-900">Key Point: {mechanism.keyPoint}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'symptoms' && (
          <div className="space-y-4">
            <p className="text-gray-700 mb-4">
              Your symptoms aren't separate problems - they're interconnected expressions of the 
              same underlying mechanisms. Each connects to multiple trauma events.
            </p>
            {symptoms.map((symptom) => (
              <div key={symptom.id} className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{symptom.title}</h3>
                <div className="mb-4">
                  <h4 className="font-bold text-gray-700 mb-2">Contributing Mechanisms:</h4>
                  <ul className="space-y-1">
                    {symptom.mechanisms.map((m, i) => (
                      <li key={i} className="text-sm text-gray-700">• {m}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-sm text-gray-600">
                    <strong>Connected to:</strong> {symptom.connectedTo.join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'interventions' && (
          <div className="space-y-6">
            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
              <p className="text-gray-800 font-medium">
                These interventions target the SPECIFIC mechanisms identified in your case. 
                This is precision healing based on your unique biological and psychological signature.
              </p>
            </div>

            {interventionModel.map((category, i) => (
              <div key={i} className="bg-white border-2 border-gray-300 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  {category.icon}
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.interventions.map((intervention, j) => (
                    <div key={j} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-2">{intervention.name}</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>How it works:</strong> {intervention.mechanism}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Methods:</strong> {intervention.methods}
                      </p>
                      <p className="text-sm text-green-800 bg-green-50 p-2 rounded">
                        <strong>Evidence:</strong> {intervention.evidence}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reframing' && (
          <div className="space-y-6">
            <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
              <p className="text-gray-800 font-medium">
                Shifting perspective from "why me?" to "what does this mean?" and "how do I integrate this?"
              </p>
            </div>

            {reframingPerspectives.map((perspective, i) => (
              <div key={i} className="bg-white border-2 border-gray-300 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{perspective.title}</h3>
                <p className="text-gray-700 mb-4">{perspective.description}</p>
                <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-600">
                  <p className="text-gray-800">
                    <strong>Reframe:</strong> {perspective.reframe}
                  </p>
                </div>
              </div>
            ))}

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-purple-300">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                The Bottom Line
              </h3>
              <p className="text-gray-800 leading-relaxed mb-3">
                This isn't karma. This isn't random. This is a <strong>specific, identifiable cascade</strong> of 
                biological and psychological events that have created your current state.
              </p>
              <p className="text-gray-800 leading-relaxed mb-3">
                Redemption isn't about erasing the past or finding silver linings. It's about achieving 
                <strong> coherent integration</strong> - where adoption, Holocaust heritage, 7/7 survival, and 
                Parkinson's can all exist in your story without destroying each other or you.
              </p>
              <p className="text-gray-800 leading-relaxed font-bold">
                You're not broken. You're complex. And complexity can be understood, integrated, and transformed.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 text-sm text-gray-600">
        <p className="mb-2">
          <strong>Note:</strong> This model synthesizes research from trauma neuroscience, epigenetics, 
          psychoneuroimmunology, and attachment theory. It's designed to help you see the SPECIFIC 
          connections in your case, not generic trauma treatment.
        </p>
        <p>
          Consider working with practitioners who understand complex trauma, somatic approaches, and 
          the biological mechanisms outlined here. You deserve treatment that matches the sophistication 
          of your experience.
        </p>
      </div>
    </div>
  );
};

export default TraumaHealingModel;