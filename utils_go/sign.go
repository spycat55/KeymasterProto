package utils_go

import (
	v1 "proto/go"

	ec "github.com/bsv-blockchain/go-sdk/primitives/ec"
	hash "github.com/bsv-blockchain/go-sdk/primitives/hash"
	"google.golang.org/protobuf/proto"
)

// SignEnvelope calculates signature over deterministic marshal of the envelope
// with Signature fields cleared and fills Signature & SignatureAlgo.
func SignEnvelope(env *v1.Envelope, priv *ec.PrivateKey) error {
	// clone and clear sig
	clone := proto.Clone(env).(*v1.Envelope)
	clone.Signature = nil
	clone.SignatureAlgo = ""

	b, err := DeterministicMarshal(clone)
	if err != nil {
		return err
	}
	digest := hash.Sha256(b)

	sig, err := priv.Sign(digest)
	if err != nil {
		return err
	}
	der, err := sig.ToDER()
	if err != nil {
		return err
	}
	env.Signature = der
	env.SignatureAlgo = "ECDSA_SECP256K1_SHA256"
	return nil
}
